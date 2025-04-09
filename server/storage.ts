import { 
  type User, type InsertUser, 
  type Rsvp, type InsertRsvp,
  type GuestMessage, type InsertGuestMessage,
  type MusicTrack, type InsertMusicTrack
} from "@shared/schema";

// Define a simplified Multer file interface instead of importing from multer
export interface UploadedFile {
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
  
  // Guest message board methods
  createGuestMessage(message: InsertGuestMessage): Promise<GuestMessage>;
  getGuestMessages(): Promise<GuestMessage[]>;
  getGuestMessageById(id: number): Promise<GuestMessage | undefined>;
  updateGuestMessageApproval(id: number, approved: boolean): Promise<GuestMessage | undefined>;
  deleteGuestMessage(id: number): Promise<boolean>;
  savePhotoAndGetUrl(file: UploadedFile): Promise<string>;
  
  // Music track methods
  createMusicTrack(track: InsertMusicTrack): Promise<MusicTrack>;
  getMusicTracks(): Promise<MusicTrack[]>;
  getActiveMusicTrack(): Promise<MusicTrack | undefined>;
  setActiveMusicTrack(id: number): Promise<boolean>;
  deleteMusicTrack(id: number): Promise<boolean>;
  saveMusicAndGetUrl(file: UploadedFile): Promise<string>;
}

import { SqliteStorage } from './sqlite-storage';

// Use SQLite storage for persistence
export const storage = new SqliteStorage();
