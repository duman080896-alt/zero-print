import { sql } from "drizzle-orm";
import { pgTable, text, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  company: text("company"),
  passwordHash: text("password_hash").notNull(),
  isVerified: boolean("is_verified").default(false),
  discount: integer("discount").default(0),
  managerId: text("manager_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  clientId: text("client_id"),
  clientName: text("client_name"),
  clientPhone: text("client_phone"),
  company: text("company"),
  items: jsonb("items"),
  totalPrice: integer("total_price"),
  branding: text("branding"),
  comment: text("comment"),
  status: text("status").default("new"),
  managerId: text("manager_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishlist = pgTable("wishlist", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  productId: text("product_id").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const managers = pgTable("managers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: text("id").primaryKey(),
  managerId: text("manager_id").notNull(),
  managerName: text("manager_name"),
  managerPhone: text("manager_phone"),
  clientId: text("client_id"),
  title: text("title"),
  clientName: text("client_name"),
  clientContact: text("client_contact"),
  clientLogoUrl: text("client_logo_url"),
  branding: text("branding"),
  comment: text("comment"),
  items: jsonb("items"),
  validDays: integer("valid_days").default(30),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});
