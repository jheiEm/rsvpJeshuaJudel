import { 
  users, type User, type InsertUser, 
  rsvps, type Rsvp, type InsertRsvp,
  guestMessages, type GuestMessage, type InsertGuestMessage
} from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Define a simplified Multer file interface instead of importing from multer
interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  getRsvps(): Promise<Rsvp[]>;
  getRsvpByEmail(email: string): Promise<Rsvp | undefined>;
  
  // New methods for guest message board
  createGuestMessage(message: InsertGuestMessage): Promise<GuestMessage>;
  getGuestMessages(): Promise<GuestMessage[]>;
  savePhotoAndGetUrl(file: UploadedFile): Promise<string>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rsvps: Map<number, Rsvp>;
  private guestMessages: Map<number, GuestMessage>;
  currentUserId: number;
  currentRsvpId: number;
  currentGuestMessageId: number;

  constructor() {
    this.users = new Map();
    this.rsvps = new Map();
    this.guestMessages = new Map();
    this.currentUserId = 1;
    this.currentRsvpId = 1;
    this.currentGuestMessageId = 1;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'client/public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const id = this.currentRsvpId++;
    const createdAt = new Date().toISOString();
    // Ensure dietary restrictions and message have null values if undefined
    const sanitizedData = {
      ...insertRsvp,
      dietaryRestrictions: insertRsvp.dietaryRestrictions || null,
      message: insertRsvp.message || null
    };
    
    const rsvp: Rsvp = { ...sanitizedData, id, createdAt };
    this.rsvps.set(id, rsvp);
    return rsvp;
  }

  async getRsvps(): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values());
  }

  async getRsvpByEmail(email: string): Promise<Rsvp | undefined> {
    return Array.from(this.rsvps.values()).find(
      (rsvp) => rsvp.email === email,
    );
  }
  
  // Guest Message Board Methods
  
  async createGuestMessage(insertMessage: InsertGuestMessage): Promise<GuestMessage> {
    const id = this.currentGuestMessageId++;
    const createdAt = new Date();
    
    // Ensure photoUrl has a null value if undefined
    const sanitizedData = {
      ...insertMessage,
      photoUrl: insertMessage.photoUrl || null
    };
    
    const message: GuestMessage = { 
      ...sanitizedData, 
      id, 
      approved: true, 
      createdAt 
    };
    
    this.guestMessages.set(id, message);
    return message;
  }
  
  async getGuestMessages(): Promise<GuestMessage[]> {
    // Return only approved messages, sorted by newest first
    return Array.from(this.guestMessages.values())
      .filter(msg => msg.approved)
      .sort((a, b) => {
        // Convert to timestamps for comparison
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return bTime - aTime; // Newest first
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

export const storage = new MemStorage();
