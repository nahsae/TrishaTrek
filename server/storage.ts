import { type User, type InsertUser, type Question, type InsertQuestion, type GameSession, type InsertGameSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllQuestions(): Promise<Question[]>;
  getQuestionsByCategory(category: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: string, question: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(id: string): Promise<boolean>;
  
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getLeaderboard(limit?: number): Promise<GameSession[]>;
  getTotalPlayers(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questions: Map<string, Question>;
  private gameSessions: Map<string, GameSession>;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.gameSessions = new Map();
    this.initializeDefaultQuestions();
  }

  private initializeDefaultQuestions() {
    const defaultQuestions: Omit<Question, 'id' | 'createdAt'>[] = [
      {
        category: "Education",
        text: "Which fancy international school did Trisha attend from 2013–2019?",
        optionA: "Dhirubhai Ambani International School",
        optionB: "Campion School",
        optionC: "Oberoi International School",
        optionD: "Bombay International Academy",
        correctAnswer: "A",
        difficulty: "easy"
      },
      {
        category: "Education",
        text: "What degree did Trisha earn from Union College in 2023?",
        optionA: "Political Science",
        optionB: "Economics",
        optionC: "Psychology",
        optionD: "Data Science",
        correctAnswer: "D",
        difficulty: "medium"
      },
      {
        category: "Achievements",
        text: "Which Latin honor did Trisha graduate with?",
        optionA: "cum laude",
        optionB: "summa cum laude",
        optionC: "magna cum laude",
        optionD: "ultra cum laude",
        correctAnswer: "C",
        difficulty: "medium"
      },
      {
        category: "Education",
        text: "Which cool role did Trisha hold on Union's campus?",
        optionA: "Residential Advisor",
        optionB: "Campus DJ",
        optionC: "Cafeteria Critic",
        optionD: "Mascot Trainer",
        correctAnswer: "A",
        difficulty: "medium"
      },
      {
        category: "Career",
        text: "Which research internship did Trisha do in Mumbai, Summer 2018?",
        optionA: "Schbang Research",
        optionB: "McKinsey & Company",
        optionC: "Bain & Company",
        optionD: "NEXTGEN Labs",
        correctAnswer: "A",
        difficulty: "hard"
      },
      {
        category: "Personal",
        text: "Which mentoring program did Trisha support in June–July 2020?",
        optionA: "Teach for India",
        optionB: "Next Genius Foundation",
        optionC: "Junior Achievement",
        optionD: "STEM Sisters",
        correctAnswer: "B",
        difficulty: "hard"
      },
      {
        category: "Career",
        text: "Which private equity firm did Trisha intern with in late 2020?",
        optionA: "Carlyle Group",
        optionB: "Paragon Partners Asia",
        optionC: "Blackstone Asia",
        optionD: "TPG Capital",
        correctAnswer: "B",
        difficulty: "hard"
      },
      {
        category: "Career",
        text: "When did Trisha start her full-time role at Goldman Sachs?",
        optionA: "January 2023",
        optionB: "July 2023",
        optionC: "September 2022",
        optionD: "June 2024",
        correctAnswer: "B",
        difficulty: "medium"
      },
      {
        category: "Career",
        text: "What is the address of Trisha's Goldman Sachs branch in the US?",
        optionA: "200 Park Avenue",
        optionB: "200 West Street",
        optionC: "1 World Trade Center",
        optionD: "250 Vesey Street",
        correctAnswer: "B",
        difficulty: "hard"
      },
      {
        category: "Achievements",
        text: "On which honor roll did Trisha remain for three straight years at Union?",
        optionA: "President's List",
        optionB: "Dean's List",
        optionC: "Chancellor's Roll",
        optionD: "Scholar's League",
        correctAnswer: "B",
        difficulty: "medium"
      },
      {
        category: "Career",
        text: "What is Trisha's current job title at Goldman Sachs?",
        optionA: "Investment Banker",
        optionB: "Portfolio Manager",
        optionC: "Financial Analyst",
        optionD: "Equity Research Associate",
        correctAnswer: "C",
        difficulty: "medium"
      },
      {
        category: "Education",
        text: "How many years did Trisha study at Union College?",
        optionA: "3",
        optionB: "4",
        optionC: "5",
        optionD: "2",
        correctAnswer: "B",
        difficulty: "easy"
      },
      {
        category: "Fun Facts",
        text: "What's Trisha's real Instagram handle?",
        optionA: "@trishaagarwal",
        optionB: "@trishaaagarwal",
        optionC: "@trishaagrawal8",
        optionD: "@trishwishy",
        correctAnswer: "D",
        difficulty: "hard"
      },
      {
        category: "Personal",
        text: "What creative title does she proudly wear in her bio?",
        optionA: "Dream Weaver",
        optionB: "Vision Crafters",
        optionC: "Dreams Architect",
        optionD: "Idea Alchemist",
        correctAnswer: "C",
        difficulty: "hard"
      },
      {
        category: "Personal",
        text: "Which cheeky line shows her generous nature?",
        optionA: "Always Giving 😉",
        optionB: "Pretty Generous",
        optionC: "Still generous.",
        optionD: "Generosity Goals",
        correctAnswer: "C",
        difficulty: "hard"
      },
      {
        category: "Personal",
        text: "Which loyal motto is she rocking?",
        optionA: "Forever by your side…",
        optionB: "I follow your lead…",
        optionC: "Where you lead, I will follow…",
        optionD: "Together, always…",
        correctAnswer: "C",
        difficulty: "hard"
      },
      {
        category: "Fun Facts",
        text: "What's her time-management mantra?",
        optionA: "Better Early Than Late…",
        optionB: "Always On Time!",
        optionC: "On My Own Clock…",
        optionD: "Late but Always Great…",
        correctAnswer: "A",
        difficulty: "medium"
      },
      {
        category: "Achievements",
        text: "What major role did Trisha play in the DAIMUN Press Corps?",
        optionA: "Head of Logistics",
        optionB: "Head of Illustration",
        optionC: "Chief Delegate",
        optionD: "Press Secretary",
        correctAnswer: "B",
        difficulty: "hard"
      },
      {
        category: "Personal",
        text: "Before starting work after graduation, which city did Trisha return to?",
        optionA: "Mumbai, India",
        optionB: "Delhi, India",
        optionC: "London, UK",
        optionD: "Dubai, UAE",
        correctAnswer: "A",
        difficulty: "medium"
      },
      {
        category: "Career",
        text: "On which Mumbai public health initiative did Trisha conduct research in Summer 2020?",
        optionA: "Swachh Bharat Mission",
        optionB: "Mumbai Health Trust",
        optionC: "Myna Mahila",
        optionD: "HealthBridge India",
        correctAnswer: "C",
        difficulty: "hard"
      }
    ];

    defaultQuestions.forEach(q => {
      const id = randomUUID();
      this.questions.set(id, {
        ...q,
        id,
        difficulty: q.difficulty || "medium",
        createdAt: new Date()
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async getQuestionsByCategory(category: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => q.category === category);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const newQuestion: Question = {
      ...question,
      id,
      difficulty: question.difficulty || "medium",
      createdAt: new Date()
    };
    this.questions.set(id, newQuestion);
    return newQuestion;
  }

  async updateQuestion(id: string, question: Partial<InsertQuestion>): Promise<Question | undefined> {
    const existing = this.questions.get(id);
    if (!existing) return undefined;
    
    const updated: Question = { ...existing, ...question };
    this.questions.set(id, updated);
    return updated;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    return this.questions.delete(id);
  }

  async createGameSession(session: InsertGameSession): Promise<GameSession> {
    const id = randomUUID();
    const newSession: GameSession = {
      playerName: session.playerName,
      score: session.score || 0,
      correctAnswers: session.correctAnswers || 0,
      totalQuestions: session.totalQuestions || 0,
      id,
      completedAt: new Date()
    };
    this.gameSessions.set(id, newSession);
    return newSession;
  }

  async getLeaderboard(limit: number = 10): Promise<GameSession[]> {
    return Array.from(this.gameSessions.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getTotalPlayers(): Promise<number> {
    return this.gameSessions.size;
  }
}

export const storage = new MemStorage();
