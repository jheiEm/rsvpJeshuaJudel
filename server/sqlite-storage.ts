import { 
  users, type User, type InsertUser, 
  rsvps, type Rsvp, type InsertRsvp,
  guestMessages, type GuestMessage, type InsertGuestMessage,
  musicTracks, type MusicTrack, type InsertMusicTrack
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
  
  CREATE TABLE IF NOT EXISTS music_tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT,
    file_path TEXT NOT NULL,
    is_active INTEGER DEFAULT 0,
    uploaded_at TEXT NOT NULL
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
  
  // New message management methods
  async getGuestMessageById(id: number): Promise<GuestMessage | undefined> {
    const message = db.select().from(guestMessages).where(eq(guestMessages.id, id)).get();
    if (!message) return undefined;
    
    return {
      ...message,
      createdAt: new Date(message.createdAt)
    };
  }
  
  async updateGuestMessageApproval(id: number, approved: boolean): Promise<GuestMessage | undefined> {
    // Execute raw SQL to update message approval
    sqlite.exec(`UPDATE guest_messages SET approved = ${approved ? 1 : 0} WHERE id = ${id}`);
    
    // Return the updated message
    return this.getGuestMessageById(id);
  }
  
  async deleteGuestMessage(id: number): Promise<boolean> {
    try {
      sqlite.exec(`DELETE FROM guest_messages WHERE id = ${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }
  
  // Music track methods
  async createMusicTrack(track: InsertMusicTrack): Promise<MusicTrack> {
    const uploadedAt = new Date();
    
    // If this track is set to active, deactivate all other tracks first
    if (track.isActive) {
      sqlite.exec('UPDATE music_tracks SET is_active = 0');
    }
    
    // Create track data
    const insertData = {
      title: track.title,
      artist: track.artist || null,
      filePath: track.filePath,
      isActive: track.isActive || false,
      uploadedAt: uploadedAt.toISOString()
    };
    
    // Use raw SQL to avoid type issues
    const sql = `INSERT INTO music_tracks (title, artist, file_path, is_active, uploaded_at) 
                VALUES (?, ?, ?, ?, ?)`;
                
    const stmt = sqlite.prepare(sql);
    const result = stmt.run(
      insertData.title,
      insertData.artist,
      insertData.filePath,
      insertData.isActive ? 1 : 0,
      insertData.uploadedAt
    );
    
    return {
      id: result.lastInsertRowid as number,
      ...insertData,
      uploadedAt
    };
  }
  
  async getMusicTracks(): Promise<MusicTrack[]> {
    // Get all music tracks with raw SQL
    const tracks = sqlite.prepare('SELECT * FROM music_tracks ORDER BY uploaded_at DESC').all();
    
    // Convert to proper types
    return tracks.map((track: any) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      filePath: track.file_path,
      isActive: Boolean(track.is_active),
      uploadedAt: new Date(track.uploaded_at)
    }));
  }
  
  async getActiveMusicTrack(): Promise<MusicTrack | undefined> {
    // Get the active track
    const stmt = sqlite.prepare('SELECT * FROM music_tracks WHERE is_active = 1 LIMIT 1');
    const track = stmt.get() as any;
    
    if (!track) return undefined;
    
    return {
      id: track.id,
      title: track.title,
      artist: track.artist,
      filePath: track.file_path,
      isActive: true,
      uploadedAt: new Date(track.uploaded_at)
    };
  }
  
  async setActiveMusicTrack(id: number): Promise<boolean> {
    try {
      // First, set all tracks to inactive
      sqlite.exec('UPDATE music_tracks SET is_active = 0');
      
      // Then set the selected track to active
      sqlite.exec(`UPDATE music_tracks SET is_active = 1 WHERE id = ${id}`);
      
      return true;
    } catch (error) {
      console.error('Error setting active track:', error);
      return false;
    }
  }
  
  async deleteMusicTrack(id: number): Promise<boolean> {
    try {
      // Get the track to check if we need to delete the file
      const stmt = sqlite.prepare('SELECT * FROM music_tracks WHERE id = ?');
      const track = stmt.get(id) as any;
      
      if (track) {
        // Delete the file from the file system
        const filePath = path.join(process.cwd(), 'client/public', track.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      // Delete from the database
      sqlite.exec(`DELETE FROM music_tracks WHERE id = ${id}`);
      
      return true;
    } catch (error) {
      console.error('Error deleting track:', error);
      return false;
    }
  }
  
  async saveMusicAndGetUrl(file: UploadedFile): Promise<string> {
    // Create music directory if it doesn't exist
    const musicDir = path.join(process.cwd(), 'client/public/music');
    if (!fs.existsSync(musicDir)) {
      fs.mkdirSync(musicDir, { recursive: true });
    }
    
    // Generate a unique filename
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileExtension = path.extname(file.originalname);
    const fileName = `${randomName}${fileExtension}`;
    
    // Path relative to public directory
    const relativePath = `/music/${fileName}`;
    
    // Full path
    const filePath = path.join(process.cwd(), 'client/public', relativePath);
    
    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);
    
    return relativePath;
  }
}