// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  status: text("status").notNull(),
  // "attending", "not-attending", "undecided"
  guestCount: integer("guest_count").notNull(),
  additionalGuests: text("additional_guests"),
  // Stores comma-separated additional guest names
  dietaryRestrictions: text("dietary_restrictions"),
  message: text("message"),
  createdAt: text("created_at").notNull()
});
var guestMessages = pgTable("guest_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  photoUrl: text("photo_url"),
  approved: boolean("approved").default(true),
  // For moderation if needed
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var musicTracks = pgTable("music_tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  filePath: text("file_path").notNull(),
  isActive: boolean("is_active").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  isYoutubeLink: boolean("is_youtube_link").default(false)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertRsvpSchema = createInsertSchema(rsvps).pick({
  name: true,
  email: true,
  phone: true,
  status: true,
  guestCount: true,
  additionalGuests: true,
  dietaryRestrictions: true,
  message: true
});
var rsvpFormSchema = insertRsvpSchema.extend({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().min(7, "Phone number is required"),
  status: z.enum(["attending", "not-attending", "undecided"], {
    errorMap: () => ({ message: "Please select an option" })
  }),
  guestCount: z.coerce.number().min(1).max(4, "Maximum of 4 guests allowed"),
  additionalGuests: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  message: z.string().optional()
});
var insertGuestMessageSchema = createInsertSchema(guestMessages).pick({
  name: true,
  message: true,
  photoUrl: true
});
var guestMessageFormSchema = insertGuestMessageSchema.extend({
  name: z.string().min(2, "Name is required"),
  message: z.string().min(1, "Message is required").max(500, "Message too long"),
  photoUrl: z.string().optional(),
  photo: z.any().optional()
  // This will represent the uploaded file
});
var insertMusicTrackSchema = createInsertSchema(musicTracks).pick({
  title: true,
  artist: true,
  filePath: true,
  isActive: true,
  isYoutubeLink: true
});
var musicTrackFormSchema = insertMusicTrackSchema.extend({
  title: z.string().min(1, "Title is required"),
  artist: z.string().optional(),
  filePath: z.string().optional(),
  // Made optional for form submission
  isActive: z.boolean().default(false),
  isYoutubeLink: z.boolean().default(false),
  musicFile: z.any().optional(),
  // This will represent the uploaded music file
  youtubeUrl: z.string().optional().refine(
    (val) => !val || val.includes("youtube.com") || val.includes("youtu.be"),
    {
      message: "Please enter a valid YouTube URL"
    }
  )
  // This will be used if it's a YouTube link
});

// server/sqlite-storage.ts
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
var sqlite = new Database("wedding.db");
var db = drizzle(sqlite);
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL,
    guest_count INTEGER NOT NULL,
    additional_guests TEXT,
    dietary_restrictions TEXT,
    message TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS guest_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    photo_url TEXT,
    approved INTEGER DEFAULT 1,
    created_at TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS music_tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT,
    file_path TEXT NOT NULL,
    is_active INTEGER DEFAULT 0,
    is_youtube_link INTEGER DEFAULT 0,
    uploaded_at TEXT NOT NULL
  );
`);
var adminExists = db.select().from(users).where(eq(users.username, "admin")).get();
if (!adminExists) {
  db.insert(users).values({
    username: "admin",
    password: "wedding2025"
    // In production, this would be hashed
  }).run();
}
var SqliteStorage = class {
  constructor() {
    const uploadsDir = path.join(process.cwd(), "client/public/uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }
  async getUser(id) {
    return db.select().from(users).where(eq(users.id, id)).get();
  }
  async getUserByUsername(username) {
    return db.select().from(users).where(eq(users.username, username)).get();
  }
  async createUser(user) {
    const result = db.insert(users).values(user).run();
    return {
      id: result.lastInsertRowid,
      ...user
    };
  }
  async createRsvp(rsvp) {
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    const sanitizedData = {
      ...rsvp,
      email: rsvp.email || null,
      additionalGuests: rsvp.additionalGuests || null,
      dietaryRestrictions: rsvp.dietaryRestrictions || null,
      message: rsvp.message || null,
      createdAt
    };
    const result = db.insert(rsvps).values(sanitizedData).run();
    return {
      id: result.lastInsertRowid,
      ...sanitizedData
    };
  }
  async getRsvps() {
    return db.select().from(rsvps).all();
  }
  async getRsvpByEmail(email) {
    return db.select().from(rsvps).where(eq(rsvps.email, email)).get();
  }
  async getRsvpById(id) {
    return db.select().from(rsvps).where(eq(rsvps.id, id)).get();
  }
  async updateRsvp(id, rsvpData) {
    const existingRsvp = await this.getRsvpById(id);
    if (!existingRsvp) return void 0;
    const updates = [];
    const values = [];
    if (rsvpData.name !== void 0) {
      updates.push("name = ?");
      values.push(rsvpData.name);
    }
    if (rsvpData.email !== void 0) {
      updates.push("email = ?");
      values.push(rsvpData.email || null);
    }
    if (rsvpData.phone !== void 0) {
      updates.push("phone = ?");
      values.push(rsvpData.phone);
    }
    if (rsvpData.status !== void 0) {
      updates.push("status = ?");
      values.push(rsvpData.status);
    }
    if (rsvpData.guestCount !== void 0) {
      updates.push("guest_count = ?");
      values.push(rsvpData.guestCount);
    }
    if (rsvpData.additionalGuests !== void 0) {
      updates.push("additional_guests = ?");
      values.push(rsvpData.additionalGuests || null);
    }
    if (rsvpData.dietaryRestrictions !== void 0) {
      updates.push("dietary_restrictions = ?");
      values.push(rsvpData.dietaryRestrictions || null);
    }
    if (rsvpData.message !== void 0) {
      updates.push("message = ?");
      values.push(rsvpData.message || null);
    }
    if (updates.length === 0) {
      return existingRsvp;
    }
    const sql = `UPDATE rsvps SET ${updates.join(", ")} WHERE id = ?`;
    values.push(id);
    const stmt = sqlite.prepare(sql);
    stmt.run(...values);
    return this.getRsvpById(id);
  }
  async deleteRsvp(id) {
    try {
      const sql = `DELETE FROM rsvps WHERE id = ?`;
      const stmt = sqlite.prepare(sql);
      stmt.run(id);
      return true;
    } catch (error) {
      console.error("Error deleting RSVP:", error);
      return false;
    }
  }
  async createGuestMessage(message) {
    const createdAt = /* @__PURE__ */ new Date();
    const insertData = {
      name: message.name,
      message: message.message,
      photoUrl: message.photoUrl || null,
      approved: true,
      createdAt: createdAt.toISOString()
    };
    const sql = `INSERT INTO guest_messages (name, message, photo_url, approved, created_at) 
                VALUES (?, ?, ?, ?, ?)`;
    const stmt = sqlite.prepare(sql);
    const result = stmt.run(
      insertData.name,
      insertData.message,
      insertData.photoUrl,
      insertData.approved ? 1 : 0,
      insertData.createdAt
    );
    return {
      id: result.lastInsertRowid,
      ...insertData,
      createdAt
      // Return the Date object for proper sorting
    };
  }
  async getGuestMessages(adminView = false) {
    try {
      const query = adminView ? `SELECT * FROM guest_messages ORDER BY created_at DESC` : `SELECT * FROM guest_messages WHERE approved = 1 ORDER BY created_at DESC`;
      const messages = sqlite.prepare(query).all();
      if (!messages || messages.length === 0) {
        return [];
      }
      return messages.map((msg) => ({
        id: msg.id,
        name: msg.name,
        message: msg.message,
        photoUrl: msg.photo_url,
        approved: Boolean(msg.approved),
        createdAt: new Date(msg.created_at)
      }));
    } catch (error) {
      console.error("Error fetching guest messages:", error);
      return [];
    }
  }
  async savePhotoAndGetUrl(file) {
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileExtension = path.extname(file.originalname);
    const fileName = `${randomName}${fileExtension}`;
    const relativePath = `/uploads/${fileName}`;
    const filePath = path.join(process.cwd(), "client/public", relativePath);
    await fs.promises.writeFile(filePath, file.buffer);
    return relativePath;
  }
  // New message management methods
  async getGuestMessageById(id) {
    try {
      const query = `SELECT * FROM guest_messages WHERE id = ? LIMIT 1`;
      const message = sqlite.prepare(query).get(id);
      if (!message) return void 0;
      return {
        id: message.id,
        name: message.name,
        message: message.message,
        photoUrl: message.photo_url,
        approved: Boolean(message.approved),
        createdAt: new Date(message.created_at)
      };
    } catch (error) {
      console.error(`Error fetching guest message by id ${id}:`, error);
      return void 0;
    }
  }
  async updateGuestMessageApproval(id, approved) {
    sqlite.exec(`UPDATE guest_messages SET approved = ${approved ? 1 : 0} WHERE id = ${id}`);
    return this.getGuestMessageById(id);
  }
  async deleteGuestMessage(id) {
    try {
      sqlite.exec(`DELETE FROM guest_messages WHERE id = ${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting message:", error);
      return false;
    }
  }
  // Music track methods
  async createMusicTrack(track) {
    const uploadedAt = /* @__PURE__ */ new Date();
    if (track.isActive) {
      sqlite.exec("UPDATE music_tracks SET is_active = 0");
    }
    const insertData = {
      title: track.title,
      artist: track.artist || null,
      filePath: track.filePath,
      isActive: track.isActive || false,
      isYoutubeLink: track.isYoutubeLink || false,
      uploadedAt: uploadedAt.toISOString()
    };
    const sql = `INSERT INTO music_tracks (title, artist, file_path, is_active, is_youtube_link, uploaded_at) 
                VALUES (?, ?, ?, ?, ?, ?)`;
    const stmt = sqlite.prepare(sql);
    const result = stmt.run(
      insertData.title,
      insertData.artist,
      insertData.filePath,
      insertData.isActive ? 1 : 0,
      insertData.isYoutubeLink ? 1 : 0,
      insertData.uploadedAt
    );
    return {
      id: result.lastInsertRowid,
      ...insertData,
      uploadedAt
    };
  }
  async getMusicTracks() {
    const tracks = sqlite.prepare("SELECT * FROM music_tracks ORDER BY uploaded_at DESC").all();
    return tracks.map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      filePath: track.file_path,
      isActive: Boolean(track.is_active),
      isYoutubeLink: Boolean(track.is_youtube_link),
      uploadedAt: new Date(track.uploaded_at)
    }));
  }
  async getActiveMusicTrack() {
    const stmt = sqlite.prepare("SELECT * FROM music_tracks WHERE is_active = 1 LIMIT 1");
    const track = stmt.get();
    if (!track) return void 0;
    return {
      id: track.id,
      title: track.title,
      artist: track.artist,
      filePath: track.file_path,
      isActive: true,
      isYoutubeLink: Boolean(track.is_youtube_link),
      uploadedAt: new Date(track.uploaded_at)
    };
  }
  async setActiveMusicTrack(id) {
    try {
      sqlite.exec("UPDATE music_tracks SET is_active = 0");
      sqlite.exec(`UPDATE music_tracks SET is_active = 1 WHERE id = ${id}`);
      return true;
    } catch (error) {
      console.error("Error setting active track:", error);
      return false;
    }
  }
  async deleteMusicTrack(id) {
    try {
      const stmt = sqlite.prepare("SELECT * FROM music_tracks WHERE id = ?");
      const track = stmt.get(id);
      if (track) {
        const filePath = path.join(process.cwd(), "client/public", track.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      sqlite.exec(`DELETE FROM music_tracks WHERE id = ${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting track:", error);
      return false;
    }
  }
  async saveMusicAndGetUrl(file) {
    const musicDir = path.join(process.cwd(), "client/public/music");
    if (!fs.existsSync(musicDir)) {
      fs.mkdirSync(musicDir, { recursive: true });
    }
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileExtension = path.extname(file.originalname);
    const fileName = `${randomName}${fileExtension}`;
    const relativePath = `/music/${fileName}`;
    const filePath = path.join(process.cwd(), "client/public", relativePath);
    await fs.promises.writeFile(filePath, file.buffer);
    return relativePath;
  }
};

// server/storage.ts
var storage = new SqliteStorage();

// server/routes.ts
import multer from "multer";
import path2 from "path";
var memStorage = multer.memoryStorage();
var imageUpload = multer({
  storage: memStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB max file size
  },
  fileFilter: (_, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname2 = filetypes.test(path2.extname(file.originalname).toLowerCase());
    if (mimetype && extname2) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});
var musicUpload = multer({
  storage: memStorage,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB max file size for music
  },
  fileFilter: (_, file, cb) => {
    const filetypes = /mp3|wav|ogg|m4a/;
    const mimetype = file.mimetype.includes("audio");
    const extname2 = filetypes.test(path2.extname(file.originalname).toLowerCase());
    if (mimetype && extname2) {
      return cb(null, true);
    }
    cb(new Error("Only audio files (MP3, WAV, OGG, M4A) are allowed!"));
  }
});
var isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
async function registerRoutes(app2) {
  app2.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "wedding2023") {
      req.session.adminAuthenticated = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
  app2.get("/api/admin/logout", (req, res) => {
    req.session.adminAuthenticated = false;
    res.json({ success: true });
  });
  app2.get("/api/admin/rsvps", isAuthenticated, async (req, res) => {
    try {
      const rsvps2 = await storage.getRsvps();
      res.json(rsvps2);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({ message: "Failed to fetch RSVPs" });
    }
  });
  app2.get("/api/admin/rsvps/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rsvp = await storage.getRsvpById(id);
      if (!rsvp) {
        return res.status(404).json({ message: "RSVP not found" });
      }
      res.json(rsvp);
    } catch (error) {
      console.error(`Error fetching RSVP ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch RSVP" });
    }
  });
  app2.put("/api/admin/rsvps/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedRsvp = await storage.updateRsvp(id, updateData);
      if (!updatedRsvp) {
        return res.status(404).json({ message: "RSVP not found" });
      }
      res.json(updatedRsvp);
    } catch (error) {
      console.error(`Error updating RSVP ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update RSVP" });
    }
  });
  app2.delete("/api/admin/rsvps/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteRsvp(id);
      if (!success) {
        return res.status(404).json({ message: "RSVP not found or could not be deleted" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting RSVP ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete RSVP" });
    }
  });
  app2.get("/api/admin/guest-messages", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getGuestMessages(true);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching guest messages:", error);
      res.status(500).json({ message: "Failed to fetch guest messages" });
    }
  });
  app2.get("/api/admin/guest-messages/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getGuestMessageById(id);
      if (!message) {
        return res.status(404).json({ message: "Guest message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error(`Error fetching guest message ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch guest message" });
    }
  });
  app2.put("/api/admin/guest-messages/:id/approve", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { approved } = req.body;
      const updatedMessage = await storage.updateGuestMessageApproval(id, approved);
      if (!updatedMessage) {
        return res.status(404).json({ message: "Guest message not found" });
      }
      res.json(updatedMessage);
    } catch (error) {
      console.error(`Error updating guest message approval ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update guest message approval" });
    }
  });
  app2.delete("/api/admin/guest-messages/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGuestMessage(id);
      if (!success) {
        return res.status(404).json({ message: "Guest message not found or could not be deleted" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting guest message ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete guest message" });
    }
  });
  app2.post("/api/rsvp", async (req, res) => {
    try {
      const validatedData = rsvpFormSchema.parse(req.body);
      if (req.body.additionalGuests) {
        validatedData.additionalGuests = req.body.additionalGuests;
      }
      if (validatedData.email) {
        const existingRsvp = await storage.getRsvpByEmail(validatedData.email);
        if (existingRsvp) {
          return res.status(400).json({
            message: "This email has already been used to RSVP"
          });
        }
      }
      const rsvp = await storage.createRsvp({
        ...validatedData
      });
      res.status(201).json({
        message: "RSVP submitted successfully",
        rsvp
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      console.error("Error creating RSVP:", error);
      res.status(500).json({
        message: "Failed to submit RSVP. Please try again later."
      });
    }
  });
  app2.get("/api/guest-messages", async (req, res) => {
    try {
      const messages = await storage.getGuestMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching guest messages:", error);
      res.status(500).json({
        message: "Failed to retrieve guest messages"
      });
    }
  });
  app2.post("/api/guest-messages", imageUpload.single("photo"), async (req, res) => {
    try {
      let photoUrl = void 0;
      if (req.file) {
        photoUrl = await storage.savePhotoAndGetUrl(req.file);
      }
      const messageData = {
        name: req.body.name,
        message: req.body.message,
        photoUrl
      };
      const validatedData = guestMessageFormSchema.parse(messageData);
      const message = await storage.createGuestMessage(validatedData);
      res.status(201).json({
        message: "Message posted successfully",
        data: message
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      if (error instanceof Error && error.name === "MulterError") {
        return res.status(400).json({
          message: error.message
        });
      }
      console.error("Error posting guest message:", error);
      res.status(500).json({
        message: "Failed to post message. Please try again later."
      });
    }
  });
  app2.get("/api/music/active", async (req, res) => {
    try {
      const track = await storage.getActiveMusicTrack();
      if (!track) {
        return res.status(404).json({ message: "No active music track found" });
      }
      res.json(track);
    } catch (error) {
      console.error("Error fetching active music track:", error);
      res.status(500).json({ message: "Failed to fetch active music track" });
    }
  });
  app2.get("/api/admin/music", isAuthenticated, async (req, res) => {
    try {
      const tracks = await storage.getMusicTracks();
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching music tracks:", error);
      res.status(500).json({ message: "Failed to fetch music tracks" });
    }
  });
  app2.post("/api/admin/music", isAuthenticated, musicUpload.single("musicFile"), async (req, res) => {
    try {
      let filePath = "";
      const isYoutubeLink = req.body.isYoutubeLink === "true";
      if (isYoutubeLink) {
        if (!req.body.youtubeUrl) {
          return res.status(400).json({ message: "No YouTube URL provided" });
        }
        filePath = req.body.youtubeUrl;
        console.log("Using YouTube URL as track source:", filePath);
      } else {
        if (!req.file) {
          return res.status(400).json({ message: "No music file provided" });
        }
        filePath = await storage.saveMusicAndGetUrl(req.file);
      }
      const trackData = {
        title: req.body.title,
        artist: req.body.artist || null,
        filePath,
        isActive: req.body.isActive === "true",
        isYoutubeLink
      };
      console.log("Creating music track with data:", JSON.stringify(trackData));
      const track = await storage.createMusicTrack(trackData);
      res.status(201).json({
        message: "Music track uploaded successfully",
        data: track
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      if (error instanceof Error && error.name === "MulterError") {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error uploading music track:", error);
      res.status(500).json({ message: "Failed to upload music track" });
    }
  });
  app2.put("/api/admin/music/:id/active", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.setActiveMusicTrack(id);
      if (!success) {
        return res.status(404).json({ message: "Track not found or could not be set as active" });
      }
      res.json({ message: "Track set as active successfully" });
    } catch (error) {
      console.error("Error setting active track:", error);
      res.status(500).json({ message: "Failed to set active track" });
    }
  });
  app2.delete("/api/admin/music/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMusicTrack(id);
      if (!success) {
        return res.status(404).json({ message: "Track not found or could not be deleted" });
      }
      res.json({ message: "Track deleted successfully" });
    } catch (error) {
      console.error("Error deleting track:", error);
      res.status(500).json({ message: "Failed to delete track" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
var MemoryStore = createMemoryStore(session);
app.use(session({
  secret: "wedding-rsvp-session-secret",
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 864e5
    // prune expired entries every 24h
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use("/api/*", (req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
  });
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
