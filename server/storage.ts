import { 
  users, 
  type User, 
  type InsertUser, 
  games,
  type Game,
  type InsertGame
} from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';
import { parseVGSalesData, convertToGameFormat } from './vg-sales-data';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | undefined>;
  
  // Game operations
  getAllGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<InsertGame>): Promise<Game | undefined>;
  deleteGame(id: number): Promise<boolean>;
  searchGames(query: string): Promise<Game[]>;
  getGamesByPlatform(platform: string): Promise<Game[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private userCurrentId: number;
  private gameCurrentId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.userCurrentId = 1;
    this.gameCurrentId = 1;
    
    // Create a default admin user
    this.createUser({
      fullName: "Admin User",
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      email: "admin@gamestore.com",
      role: "admin"
    });
    
    // Add some sample games for testing
    this.createSampleGames();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { ...insertUser, id, lastLogin: now };
    this.users.set(id, user);
    return user;
  }
  
  async validateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      // Update last login
      const updatedUser = { ...user, lastLogin: new Date() };
      this.users.set(user.id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Game operations
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.gameCurrentId++;
    const now = new Date();
    const game: Game = { ...insertGame, id, createdAt: now };
    this.games.set(id, game);
    return game;
  }

  async updateGame(id: number, gameUpdate: Partial<InsertGame>): Promise<Game | undefined> {
    const existingGame = this.games.get(id);
    if (!existingGame) {
      return undefined;
    }
    
    const updatedGame = { ...existingGame, ...gameUpdate };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async deleteGame(id: number): Promise<boolean> {
    return this.games.delete(id);
  }
  
  async searchGames(query: string): Promise<Game[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.games.values()).filter(game => 
      game.title.toLowerCase().includes(lowerQuery) || 
      game.developer.toLowerCase().includes(lowerQuery) ||
      game.publisher.toLowerCase().includes(lowerQuery) ||
      game.genre.toLowerCase().includes(lowerQuery)
    );
  }
  
  async getGamesByPlatform(platform: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => {
      const platforms = game.platforms as Record<string, boolean>;
      return platform ? platforms[platform] === true : true;
    });
  }
  
  // Helper method to create sample games
  private createSampleGames() {
    try {
      // Try to read the VGSales data
      const vgSalesPath = path.join(process.cwd(), 'vgsales.csv');
      
      if (fs.existsSync(vgSalesPath)) {
        // Read the CSV file
        const csvData = fs.readFileSync(vgSalesPath, 'utf8');
        
        // Parse the CSV data
        const vgSalesData = parseVGSalesData(csvData);
        
        // Convert to our Game format
        const gameData = convertToGameFormat(vgSalesData);
        
        // Add the games to our storage
        gameData.forEach(game => {
          const insertGame: InsertGame = {
            title: game.title,
            description: game.description,
            releaseDate: game.releaseDate,
            platforms: game.platforms,
            genre: game.genre,
            developer: game.developer,
            publisher: game.publisher,
            price: game.price,
            stock: game.stock,
            imageUrl: game.imageUrl
          };
          this.createGame(insertGame);
        });
        
        console.log(`Loaded ${gameData.length} games from VGSales data`);
        return;
      }
    } catch (error) {
      console.error('Error loading VGSales data:', error);
    }
    
    // Fallback to original sample games if VGSales data can't be loaded
    const sampleGames: InsertGame[] = [
      {
        title: "Cyberpunk 2077",
        description: "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
        releaseDate: "2020-12-10",
        platforms: { pc: true, ps5: true, xsx: true, switch: false },
        genre: "RPG",
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        price: 59.99,
        stock: 45,
        imageUrl: null
      },
      {
        title: "Elden Ring",
        description: "Elden Ring is an action RPG that takes place in the Lands Between, a realm ruled by demigods who possess fragments of the titular Elden Ring.",
        releaseDate: "2022-02-25",
        platforms: { pc: true, ps5: true, xsx: true, switch: false },
        genre: "Action RPG",
        developer: "FromSoftware",
        publisher: "Bandai Namco",
        price: 69.99,
        stock: 8,
        imageUrl: null
      },
      {
        title: "God of War: Ragnarök",
        description: "God of War Ragnarök is an action-adventure game that continues the story of Kratos and his son Atreus as they prepare for Ragnarök.",
        releaseDate: "2022-11-09",
        platforms: { pc: false, ps5: true, xsx: false, switch: false },
        genre: "Action Adventure",
        developer: "Santa Monica Studio",
        publisher: "Sony Interactive Entertainment",
        price: 69.99,
        stock: 32,
        imageUrl: null
      },
      {
        title: "Starfield",
        description: "Starfield is the first new universe in 25 years from Bethesda Game Studios, the creators of The Elder Scrolls V: Skyrim and Fallout 4.",
        releaseDate: "2023-09-06",
        platforms: { pc: true, ps5: false, xsx: true, switch: false },
        genre: "RPG",
        developer: "Bethesda Game Studios",
        publisher: "Bethesda Softworks",
        price: 69.99,
        stock: 0,
        imageUrl: null
      },
      {
        title: "The Legend of Zelda: Tears of the Kingdom",
        description: "The Legend of Zelda: Tears of the Kingdom is the sequel to The Legend of Zelda: Breath of the Wild.",
        releaseDate: "2023-05-12",
        platforms: { pc: false, ps5: false, xsx: false, switch: true },
        genre: "Action Adventure",
        developer: "Nintendo",
        publisher: "Nintendo",
        price: 59.99,
        stock: 55,
        imageUrl: null
      }
    ];
    
    sampleGames.forEach(game => this.createGame(game));
  }
}

export const storage = new MemStorage();
