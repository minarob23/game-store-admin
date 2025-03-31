import express from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameFormSchema, loginSchema, type Game } from "@shared/schema";
import { ZodError } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

// Format zod errors into a friendly message
function formatZodError(error: ZodError) {
  return Object.fromEntries(
    error.errors.map((err) => [
      err.path.join("."),
      err.message
    ])
  );
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "gaming-admin-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 },
      store: new SessionStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    })
  );

  // Authentication middleware
  function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.session.userId) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  // Authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await storage.validateUser(credentials.username, credentials.password);
      
      if (user) {
        req.session.userId = user.id;
        req.session.role = user.role;

        return res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        });
      }
      
      return res.status(401).json({ message: "Invalid username or password" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      return res.status(500).json({ message: "Server error during login" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth-check", (req, res) => {
    if (req.session.userId) {
      return res.status(200).json({ authenticated: true, role: req.session.role });
    }
    return res.status(200).json({ authenticated: false });
  });

  // Game routes (protected by auth middleware)
  app.get("/api/games", isAuthenticated, async (req, res) => {
    try {
      const { search, platform } = req.query;
      
      let games: Game[];
      if (search) {
        games = await storage.searchGames(search as string);
      } else if (platform && platform !== 'all') {
        games = await storage.getGamesByPlatform(platform as string);
      } else {
        games = await storage.getAllGames();
      }
      
      return res.status(200).json(games);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to retrieve games" });
    }
  });

  app.get("/api/games/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }
      
      const game = await storage.getGame(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      return res.status(200).json(game);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to retrieve game" });
    }
  });

  app.post("/api/games", isAuthenticated, async (req, res) => {
    try {
      const gameData = gameFormSchema.parse(req.body);
      const newGame = await storage.createGame(gameData);
      return res.status(201).json(newGame);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      console.error(error);
      return res.status(500).json({ message: "Failed to create game" });
    }
  });

  app.put("/api/games/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }
      
      const gameData = gameFormSchema.parse(req.body);
      const updatedGame = await storage.updateGame(id, gameData);
      
      if (!updatedGame) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      return res.status(200).json(updatedGame);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: formatZodError(error) });
      }
      console.error(error);
      return res.status(500).json({ message: "Failed to update game" });
    }
  });

  app.delete("/api/games/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }
      
      const deleted = await storage.deleteGame(id);
      if (!deleted) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      return res.status(200).json({ message: "Game deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to delete game" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const games = await storage.getAllGames();
      
      // Calculate statistics
      const totalGames = games.length;
      const lowStock = games.filter(game => game.stock > 0 && game.stock < 10).length;
      const outOfStock = games.filter(game => game.stock === 0).length;
      
      // Get games released in the last 30 days
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const newReleases = games.filter(game => {
        const releaseDate = new Date(game.releaseDate);
        return releaseDate >= thirtyDaysAgo;
      }).length;
      
      // Calculate total revenue (price * stock)
      const revenue = games.reduce((total, game) => total + (game.price * game.stock), 0);
      
      // Get platform distribution
      const platforms = {
        pc: 0,
        ps5: 0,
        xsx: 0,
        switch: 0
      };
      
      games.forEach(game => {
        const gamePlatforms = game.platforms as Record<string, boolean>;
        for (const [platform, isAvailable] of Object.entries(gamePlatforms)) {
          if (isAvailable && platform in platforms) {
            platforms[platform as keyof typeof platforms]++;
          }
        }
      });
      
      // Calculate percentages
      const totalPlatformCount = Object.values(platforms).reduce((sum, count) => sum + count, 0);
      const platformPercentages = Object.fromEntries(
        Object.entries(platforms).map(([platform, count]) => [
          platform, 
          totalPlatformCount > 0 ? Math.round((count / totalPlatformCount) * 100) : 0
        ])
      );
      
      // Get recent games (last 5 added)
      const recentGames = [...games]
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5);
      
      return res.status(200).json({
        stats: {
          totalGames,
          newReleases,
          lowStock,
          outOfStock,
          revenue: revenue.toFixed(2)
        },
        platforms: platformPercentages,
        recentGames
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to retrieve dashboard statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
