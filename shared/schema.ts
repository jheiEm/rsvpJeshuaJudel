import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull(), // "attending", "not-attending", "undecided"
  guestCount: integer("guest_count").notNull(),
  dietaryRestrictions: text("dietary_restrictions"),
  message: text("message"),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRsvpSchema = createInsertSchema(rsvps).pick({
  name: true,
  email: true,
  phone: true,
  status: true,
  guestCount: true,
  dietaryRestrictions: true,
  message: true,
});

// Extend the schema to add validation
export const rsvpFormSchema = insertRsvpSchema.extend({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Phone number is required"),
  status: z.enum(["attending", "not-attending", "undecided"], {
    errorMap: () => ({ message: "Please select an option" }),
  }),
  guestCount: z.coerce.number().min(1).max(4, "Maximum of 4 guests allowed"),
  dietaryRestrictions: z.string().optional(),
  message: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvps.$inferSelect;
