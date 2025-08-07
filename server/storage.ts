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
        text: "Which prestigious college did Trisha attend for her undergraduate studies?",
        optionA: "Harvard University",
        optionB: "Union College",
        optionC: "Columbia University", 
        optionD: "NYU Stern",
        correctAnswer: "B",
        difficulty: "easy"
      },
      {
        category: "Education",
        text: "What high school did Trisha attend before college?",
        optionA: "Dhirubhai Ambani High School",
        optionB: "Delhi Public School",
        optionC: "St. Xavier's High School",
        optionD: "Modern School",
        correctAnswer: "A",
        difficulty: "easy"
      },
      {
        category: "Career",
        text: "Where does Trisha currently work?",
        optionA: "Morgan Stanley",
        optionB: "JPMorgan Chase",
        optionC: "Goldman Sachs",
        optionD: "Credit Suisse",
        correctAnswer: "C",
        difficulty: "easy"
      },
      {
        category: "Personal",
        text: "What milestone birthday is Trisha celebrating this year?",
        optionA: "24th",
        optionB: "25th",
        optionC: "26th",
        optionD: "23rd",
        correctAnswer: "B",
        difficulty: "easy"
      },
      {
        category: "Career",
        text: "Goldman Sachs is known for which primary business?",
        optionA: "Technology Consulting",
        optionB: "Investment Banking",
        optionC: "Retail Banking",
        optionD: "Insurance",
        correctAnswer: "B",
        difficulty: "medium"
      },
      {
        category: "Education",
        text: "Union College is located in which state?",
        optionA: "New York",
        optionB: "Massachusetts",
        optionC: "Connecticut",
        optionD: "New Jersey",
        correctAnswer: "A",
        difficulty: "medium"
      },
      {
        category: "Achievements",
        text: "What type of degree program would someone typically pursue at Union College?",
        optionA: "Associate Degree",
        optionB: "Bachelor's Degree",
        optionC: "Certificate Program",
        optionD: "Trade School",
        correctAnswer: "B",
        difficulty: "easy"
      },
      {
        category: "Fun Facts",
        text: "Which decade was Trisha born in?",
        optionA: "1990s",
        optionB: "2000s",
        optionC: "1980s",
        optionD: "2010s",
        correctAnswer: "A",
        difficulty: "easy"
      },
      {
        category: "Career",
        text: "What sector does Goldman Sachs primarily operate in?",
        optionA: "Healthcare",
        optionB: "Financial Services",
        optionC: "Technology",
        optionD: "Manufacturing",
        correctAnswer: "B",
        difficulty: "easy"
      },
      {
        category: "Personal",
        text: "How many years has it been since Trisha graduated from high school (assuming 2017 graduation)?",
        optionA: "6 years",
        optionB: "7 years",
        optionC: "8 years",
        optionD: "5 years",
        correctAnswer: "B",
        difficulty: "medium"
      }
    ];

    defaultQuestions.forEach(q => {
      const id = randomUUID();
      this.questions.set(id, {
        ...q,
        id,
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
      ...session,
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
