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
        category: "Personal",
        text: "Trisha ka childhood ka adda kaunsa sheher tha? (Which city did Trisha grow up in?)",
        optionA: "Chennai",
        optionB: "Mumbai",
        optionC: "Kolkata",
        optionD: "Pune",
        correctAnswer: "B",
        difficulty: "easy"
      },
      {
        category: "Education",
        text: "2013–2019 tak Trisha ne kaunsi fancy international school mein padhai ki? (Which fancy international school did Trisha attend from 2013–2019?)",
        optionA: "Dhirubhai Ambani International School",
        optionB: "Campion School",
        optionC: "Oberoi International School",
        optionD: "Bombay International Academy",
        correctAnswer: "A",
        difficulty: "easy"
      },
      {
        category: "Education",
        text: "2023 mein Union College se Trisha ne kya degree haasil ki? (What degree did Trisha earn from Union College in 2023?)",
        optionA: "Political Science",
        optionB: "Economics",
        optionC: "Psychology",
        optionD: "Data Science",
        correctAnswer: "B",
        difficulty: "medium"
      },
      {
        category: "Achievements",
        text: "Latin mein Trisha ke naam ke aage kaunsa dhamakedaar honor tha? (Which Latin honor did Trisha graduate with?)",
        optionA: "cum laude",
        optionB: "summa cum laude",
        optionC: "magna cum laude",
        optionD: "ultra cum laude",
        correctAnswer: "B",
        difficulty: "hard"
      },
      {
        category: "Education",
        text: "Union College campus par Trisha ne kaunsa 'cool' role nibhaaya? (Which 'cool' role did Trisha hold on Union's campus?)",
        optionA: "Residential Advisor",
        optionB: "Campus DJ",
        optionC: "Cafeteria Critic",
        optionD: "Mascot Trainer",
        correctAnswer: "A",
        difficulty: "medium"
      },
      {
        category: "Career",
        text: "Summer 2018 mein Trisha ne Mumbai mein kaunsi research internship ki? (Which research internship did Trisha do in Mumbai, Summer 2018?)",
        optionA: "Schbang Research",
        optionB: "McKinsey & Company",
        optionC: "Bain & Company",
        optionD: "NEXTGEN Labs",
        correctAnswer: "A",
        difficulty: "hard"
      },
      {
        category: "Personal",
        text: "June–July 2020 mein Trisha ne kis mentoring program ko support kiya? (Which mentoring program did Trisha support in June–July 2020?)",
        optionA: "Teach for India",
        optionB: "Next Genius Foundation",
        optionC: "Junior Achievement",
        optionD: "STEM Sisters",
        correctAnswer: "B",
        difficulty: "hard"
      },
      {
        category: "Career",
        text: "Summer 2020 mein Trisha ne Mumbai ke kis public health initiative par research ki? (On which Mumbai public health initiative did Trisha conduct research in Summer 2020?)",
        optionA: "Swachh Bharat Mission",
        optionB: "Mumbai Health Trust",
        optionC: "Myna Mahila",
        optionD: "HealthBridge India",
        correctAnswer: "C",
        difficulty: "hard"
      },
      {
        category: "Career",
        text: "Late 2020 mein Trisha ne kaunsi private equity firm ke saath intern kiya? (Which private equity firm did Trisha intern with in late 2020?)",
        optionA: "Carlyle Group",
        optionB: "Paragon Partners Asia",
        optionC: "Blackstone Asia",
        optionD: "TPG Capital",
        correctAnswer: "B",
        difficulty: "hard"
      },
      {
        category: "Career",
        text: "Trisha ne Goldman Sachs mein full-time kaam kab start kiya? (When did Trisha start her full-time role at Goldman Sachs?)",
        optionA: "January 2023",
        optionB: "July 2023",
        optionC: "September 2022",
        optionD: "June 2024",
        correctAnswer: "B",
        difficulty: "medium"
      },
      {
        category: "Career",
        text: "Goldman Sachs ki US office mein Trisha ka branch address kya hai? (What is the address of Trisha's Goldman Sachs branch in the US?)",
        optionA: "200 Park Avenue",
        optionB: "200 West Street",
        optionC: "1 World Trade Center",
        optionD: "250 Vesey Street",
        correctAnswer: "B",
        difficulty: "hard"
      },
      {
        category: "Achievements",
        text: "Trisha ne Union College ki kis honor roll mein 3 saal tak jagah banaye rakhi? (On which honor roll did Trisha remain for three straight years at Union?)",
        optionA: "President's List",
        optionB: "Dean's List",
        optionC: "Chancellor's Roll",
        optionD: "Scholar's League",
        correctAnswer: "B",
        difficulty: "medium"
      },
      {
        category: "Career",
        text: "Trisha ke pehla GS summer analyst internship kis city mein tha? (In which city was Trisha's first Goldman Sachs summer analyst internship?)",
        optionA: "New York, NY",
        optionB: "Albany, NY",
        optionC: "Chicago, IL",
        optionD: "San Francisco, CA",
        correctAnswer: "B",
        difficulty: "hard"
      },
      {
        category: "Career",
        text: "Trisha ke doosra GS summer analyst internship kis city mein tha? (In which city was her second Goldman Sachs summer analyst internship?)",
        optionA: "Miami, FL",
        optionB: "New York, NY",
        optionC: "Boston, MA",
        optionD: "Los Angeles, CA",
        correctAnswer: "B",
        difficulty: "medium"
      },
      {
        category: "Personal",
        text: "Graduation ke baad job shuru karne se pehle Trisha kis sheher wapas gayi thi? (Before starting work after graduation, which city did Trisha return to?)",
        optionA: "Mumbai, India",
        optionB: "Delhi, India",
        optionC: "London, UK",
        optionD: "Dubai, UAE",
        correctAnswer: "A",
        difficulty: "medium"
      },
      {
        category: "Career",
        text: "Goldman Sachs mein Trisha ka current job title kya hai? (What is Trisha's current job title at Goldman Sachs?)",
        optionA: "Investment Banker",
        optionB: "Portfolio Manager",
        optionC: "Financial Analyst",
        optionD: "Equity Research Associate",
        correctAnswer: "C",
        difficulty: "medium"
      },
      {
        category: "Education",
        text: "Trisha ne Union College mein kitne saal padhai ki? (How many years did Trisha study at Union College?)",
        optionA: "3",
        optionB: "4",
        optionC: "5",
        optionD: "2",
        correctAnswer: "B",
        difficulty: "easy"
      },
      {
        category: "Fun Facts",
        text: "Trisha ne apne college ke fun fest mein kya role play kiya ho sakta tha? (What role might Trisha have played at her college fun fest?)",
        optionA: "Dance Performer",
        optionB: "Debate Champion",
        optionC: "Event Organizer",
        optionD: "Stand-up Comedian",
        correctAnswer: "C",
        difficulty: "medium"
      },
      {
        category: "Fun Facts",
        text: "Trisha ki favorite chai special kaunsa laga sakte ho? (Which special chai do you think is Trisha's favorite?)",
        optionA: "Masala Chai",
        optionB: "Adrak Chai",
        optionC: "Elaichi Chai",
        optionD: "Sab kuch mix — ultimate chai!",
        correctAnswer: "D",
        difficulty: "easy"
      },
      {
        category: "Fun Facts",
        text: "Trisha ka asli Instagram handle kya hai? (What's her real Instagram handle?)",
        optionA: "@trishaagarwal",
        optionB: "@trishaaagarwal",
        optionC: "@trishaagrawal8",
        optionD: "@trishwishy",
        correctAnswer: "C",
        difficulty: "hard"
      },
      {
        category: "Personal",
        text: "Trisha apni bio mein kaunsa creative title use karti hai? (What creative title does she proudly wear in her bio?)",
        optionA: "Dream Weaver",
        optionB: "Vision Crafters",
        optionC: "Dreams Architect",
        optionD: "Idea Alchemist",
        correctAnswer: "C",
        difficulty: "hard"
      },
      {
        category: "Personal",
        text: "Kaunsi cheeky line Trisha ki generous nature dikhati hai? (Which cheeky line shows her generous nature?)",
        optionA: "Always Giving 😉",
        optionB: "Pretty Generous",
        optionC: "Still generous.",
        optionD: "Generosity Goals",
        correctAnswer: "C",
        difficulty: "hard"
      },
      {
        category: "Personal",
        text: "Kaunsa loyal motto Trisha use karti hai? (Which loyal motto is she rocking?)",
        optionA: "Forever by your side…",
        optionB: "I follow your lead…",
        optionC: "Where you lead, I will follow…",
        optionD: "Together, always…",
        correctAnswer: "C",
        difficulty: "hard"
      },
      {
        category: "Fun Facts",
        text: "Woh apna time-management mantra kya rakhti hai? (What's her time-management mantra?)",
        optionA: "Better Early Than Late…",
        optionB: "Always On Time!",
        optionC: "On My Own Clock…",
        optionD: "Late but Always Great…",
        correctAnswer: "D",
        difficulty: "medium"
      },
      {
        category: "Achievements",
        text: "DAIMUN Press Corps mein Trisha ne kaunsa bada role nibhaaya tha? (What major role did Trisha play in the DAIMUN Press Corps?)",
        optionA: "Head of Logistics",
        optionB: "Head of Illustration",
        optionC: "Chief Delegate",
        optionD: "Press Secretary",
        correctAnswer: "B",
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
