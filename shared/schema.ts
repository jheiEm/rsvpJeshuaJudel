import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
  email: text("email"),
  phone: text("phone").notNull(),
  status: text("status").notNull(), // "attending", "not-attending", "undecided"
  guestCount: integer("guest_count").notNull(),
  additionalGuests: text("additional_guests"), // Stores comma-separated additional guest names
  dietaryRestrictions: text("dietary_restrictions"),
  message: text("message"),
  createdAt: text("created_at").notNull(),
});

// New schema for guest messages with photo uploads
export const guestMessages = pgTable("guest_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  photoUrl: text("photo_url"),
  approved: boolean("approved").default(true), // For moderation if needed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema for music tracks
export const musicTracks = pgTable("music_tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  filePath: text("file_path").notNull(),
  isActive: boolean("is_active").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  isYoutubeLink: boolean("is_youtube_link").default(false),
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
  additionalGuests: true,
  dietaryRestrictions: true,
  message: true,
});

// Extend the schema to add validation
export const rsvpFormSchema = insertRsvpSchema.extend({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().min(7, "Phone number is required"),
  status: z.enum(["attending", "not-attending", "undecided"], {
    errorMap: () => ({ message: "Please select an option" }),
  }),
  guestCount: z.coerce.number().min(1).max(4, "Maximum of 4 guests allowed"),
  additionalGuests: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  message: z.string().optional(),
});

// Schema for guest message board messages
export const insertGuestMessageSchema = createInsertSchema(guestMessages).pick({
  name: true,
  message: true,
  photoUrl: true,
});

// Form schema for guest message board with file upload
export const guestMessageFormSchema = insertGuestMessageSchema.extend({
  name: z.string().min(2, "Name is required"),
  message: z.string().min(1, "Message is required").max(500, "Message too long"),
  photoUrl: z.string().optional(),
  photo: z.any().optional() // This will represent the uploaded file
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvps.$inferSelect;

// Schema for music tracks
export const insertMusicTrackSchema = createInsertSchema(musicTracks).pick({
  title: true,
  artist: true,
  filePath: true,
  isActive: true,
  isYoutubeLink: true,
});

// Form schema for music track uploads
export const musicTrackFormSchema = insertMusicTrackSchema.extend({
  title: z.string().min(1, "Title is required"),
  artist: z.string().optional(),
  filePath: z.string().optional(), // Made optional for form submission
  isActive: z.boolean().default(false),
  isYoutubeLink: z.boolean().default(false),
  musicFile: z.any().optional(), // This will represent the uploaded music file
  youtubeUrl: z.string().optional().refine(
    (val) => !val || val.includes('youtube.com') || val.includes('youtu.be'),
    {
      message: 'Please enter a valid YouTube URL',
    }
  ), // This will be used if it's a YouTube link
});

export type InsertGuestMessage = z.infer<typeof insertGuestMessageSchema>;
export type GuestMessage = typeof guestMessages.$inferSelect;
export type GuestMessageFormValues = z.infer<typeof guestMessageFormSchema>;

export type InsertMusicTrack = z.infer<typeof insertMusicTrackSchema>;
export type MusicTrack = typeof musicTracks.$inferSelect;
export type MusicTrackFormValues = z.infer<typeof musicTrackFormSchema>;
