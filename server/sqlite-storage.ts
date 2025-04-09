import { 
  users, type User, type InsertUser, 
  rsvps, type Rsvp, type InsertRsvp,
  guestMessages, type GuestMessage, type InsertGuestMessage
} from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { IStorage, UploadedFile } from './storage';

// Setup SQLite database
const sqlite = new Database('wedding.db');
const db = drizzle(sqlite);

// Create tables if they don't exist
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
`);

// Seed the default admin user if it doesn't exist
const adminExists = db.select().from(users).where(eq(users.username, 'admin')).get();
if (!adminExists) {
  db.insert(users).values({
    username: 'admin',
    password: 'wedding2025' // In production, this would be hashed
  }).run();
}

export class SqliteStorage implements IStorage {
  constructor() {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'client/public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.username, username)).get();
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = db.insert(users).values(user).run();
    return {
      id: result.lastInsertRowid as number,
      ...user
    };
  }

  async createRsvp(rsvp: InsertRsvp): Promise<Rsvp> {
    const createdAt = new Date().toISOString();
    const sanitizedData = {
      ...rsvp,
      dietaryRestrictions: rsvp.dietaryRestrictions || null,
      message: rsvp.message || null,
      createdAt
    };
    
    const result = db.insert(rsvps).values(sanitizedData).run();
    
    return {
      id: result.lastInsertRowid as number,
      ...sanitizedData
    };
  }

  async getRsvps(): Promise<Rsvp[]> {
    return db.select().from(rsvps).all();
  }

  async getRsvpByEmail(email: string): Promise<Rsvp | undefined> {
    return db.select().from(rsvps).where(eq(rsvps.email, email)).get();
  }
  
  async createGuestMessage(message: InsertGuestMessage): Promise<GuestMessage> {
    const createdAt = new Date();
    
    // Create a proper object that matches the expected schema
    const insertData = {
      name: message.name,
      message: message.message,
      photoUrl: message.photoUrl || null,
      approved: true,
      createdAt: createdAt.toISOString()
    };
    
    // Use SQL directly to avoid the type error
    const sql = `INSERT INTO guest_messages (name, message, photoUrl, approved, createdAt) 
                VALUES (?, ?, ?, ?, ?)`;
    
    const result = db.prepare(sql).run(
      insertData.name,
      insertData.message,
      insertData.photoUrl,
      insertData.approved ? 1 : 0,
      insertData.createdAt
    );
    
    return {
      id: result.lastInsertRowid as number,
      ...insertData,
      createdAt // Return the Date object for proper sorting
    };
  }
  
  async getGuestMessages(): Promise<GuestMessage[]> {
    // Return only approved messages, sorted by newest first
    const messages = db.select()
      .from(guestMessages)
      .where(eq(guestMessages.approved, true))
      .all();
      
    // Convert string dates to Date objects for the frontend
    return messages.map(msg => ({
      ...msg,
      createdAt: new Date(msg.createdAt)
    }))
    .sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }
  
  async savePhotoAndGetUrl(file: UploadedFile): Promise<string> {
    // Generate a unique filename to prevent collisions
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileExtension = path.extname(file.originalname);
    const fileName = `${randomName}${fileExtension}`;
    
    // Path where the file will be saved (relative to the public directory)
    const relativePath = `/uploads/${fileName}`;
    
    // Full path to save the file
    const filePath = path.join(process.cwd(), 'client/public', relativePath);
    
    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);
    
    // Return the URL (relative to public directory)
    return relativePath;
  }
}