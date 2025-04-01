import { pgTable, text, serial, integer, boolean, date, jsonb, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull().default(""),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("admin"),
  lastLogin: timestamp("last_login"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  fullName: true,
  username: true,
  password: true,
  email: true,
  role: true,
});

// Game Schema
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  releaseDate: date("release_date").notNull(),
  platforms: jsonb("platforms").notNull(),
  genre: text("genre").notNull(),
  developer: text("developer").notNull(),
  publisher: text("publisher").notNull(),
  price: doublePrecision("price").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameSchema = createInsertSchema(games).pick({
  title: true,
  description: true,
  releaseDate: true,
  platforms: true,
  genre: true,
  developer: true,
  publisher: true,
  price: true,
  stock: true,
  imageUrl: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

// Platform type for validation
export const platformSchema = z.object({
  pc: z.boolean().optional(),
  // PlayStation Family
  ps5: z.boolean().optional(),
  ps4: z.boolean().optional(),
  ps3: z.boolean().optional(),
  ps2: z.boolean().optional(),
  ps: z.boolean().optional(), // Original PlayStation
  // Xbox Family
  xsx: z.boolean().optional(), // Xbox Series X
  xone: z.boolean().optional(), // Xbox One
  x360: z.boolean().optional(), // Xbox 360
  xbox: z.boolean().optional(), // Original Xbox
  // Nintendo Family
  switch: z.boolean().optional(),
  wiiu: z.boolean().optional(),
  wii: z.boolean().optional(),
  "3ds": z.boolean().optional(),
  ds: z.boolean().optional(),
  // Other platforms
  psp: z.boolean().optional(),
  vita: z.boolean().optional(),
  gc: z.boolean().optional(), // GameCube
  n64: z.boolean().optional(), // Nintendo 64
  gb: z.boolean().optional(), // Game Boy
  gba: z.boolean().optional(), // Game Boy Advance
  snes: z.boolean().optional(), // Super Nintendo
  nes: z.boolean().optional(), // Nintendo Entertainment System
  sega: z.boolean().optional(), // Sega platforms
  mobile: z.boolean().optional(), // Mobile gaming
  other: z.boolean().optional(), // Other platforms
});

export type Platform = z.infer<typeof platformSchema>;

// Extended game schema with validation for frontend forms
export const gameFormSchema = insertGameSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  releaseDate: z.string().or(z.date()),
  platforms: platformSchema,
  genre: z.string().min(1, "Genre is required"),
  developer: z.string().min(1, "Developer is required"),
  publisher: z.string().min(1, "Publisher is required"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().optional(),
});

// Credentials schema for login
export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
