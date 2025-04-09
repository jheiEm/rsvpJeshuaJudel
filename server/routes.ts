import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRsvpSchema, rsvpFormSchema, guestMessageFormSchema, musicTrackFormSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

// Helper interface for multer file
interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

// Multer setup for file uploads
const memStorage = multer.memoryStorage();

// Image upload configuration
const imageUpload = multer({
  storage: memStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (_, file, cb) => {
    // Check if the file is an image
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

// Music upload configuration
const musicUpload = multer({
  storage: memStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for music
  },
  fileFilter: (_, file, cb) => {
    // Check if the file is an audio file
    const filetypes = /mp3|wav|ogg|m4a/;
    const mimetype = file.mimetype.includes('audio');
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only audio files (MP3, WAV, OGG, M4A) are allowed!"));
  }
});

// Extend Express Session
declare module "express-session" {
  interface SessionData {
    adminAuthenticated?: boolean;
  }
}

// Admin middleware to check authentication
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.adminAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // RSVP submission endpoint
  app.post("/api/rsvp", async (req, res) => {
    try {
      // Validate the request data against our schema
      const validatedData = rsvpFormSchema.parse(req.body);
      
      // Check if email already exists
      const existingRsvp = await storage.getRsvpByEmail(validatedData.email);
      if (existingRsvp) {
        return res.status(400).json({
          message: "This email has already been used to RSVP"
        });
      }
      
      // Create the RSVP in storage
      const rsvp = await storage.createRsvp({
        ...validatedData,
      });
      
      // Return the created RSVP
      res.status(201).json({
        message: "RSVP submitted successfully",
        rsvp,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ZodError") {
        // Handle validation errors
        return res.status(400).json({
          message: "Validation failed",
          errors: (error as any).errors,
        });
      }
      
      // Handle other errors
      console.error("Error creating RSVP:", error);
      res.status(500).json({
        message: "Failed to submit RSVP. Please try again later.",
      });
    }
  });

  // Guest Message Board Endpoints
  
  // Get all guest messages
  app.get("/api/guest-messages", async (req, res) => {
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
  
  // Post a new guest message (with optional photo)
  app.post("/api/guest-messages", imageUpload.single('photo'), async (req, res) => {
    try {
      let photoUrl = undefined;
      
      // If a photo was uploaded, save it and get the URL
      if (req.file) {
        photoUrl = await storage.savePhotoAndGetUrl(req.file);
      }
      
      // Combine form data with the photo URL if it exists
      const messageData = {
        name: req.body.name,
        message: req.body.message,
        photoUrl
      };
      
      // Validate the data
      const validatedData = guestMessageFormSchema.parse(messageData);
      
      // Save the message
      const message = await storage.createGuestMessage(validatedData);
      
      res.status(201).json({
        message: "Message posted successfully",
        data: message
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ZodError") {
        // Handle validation errors
        return res.status(400).json({
          message: "Validation failed",
          errors: (error as any).errors,
        });
      }
      
      // Handle multer errors
      if (error instanceof Error && error.name === "MulterError") {
        return res.status(400).json({
          message: error.message
        });
      }
      
      // Handle other errors
      console.error("Error posting guest message:", error);
      res.status(500).json({
        message: "Failed to post message. Please try again later."
      });
    }
  });

  // Admin routes
  app.post("/api/admin/login", (req, res) => {
    // In a real application, you would validate against a database
    // For this example, we'll use a hardcoded username/password
    const { username, password } = req.body;
    
    // Replace with your desired admin credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "wedding2025";
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set the admin as authenticated in the session
      req.session.adminAuthenticated = true;
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
  
  app.post("/api/admin/logout", (req, res) => {
    // Clear the session
    if (req.session) {
      req.session.adminAuthenticated = false;
    }
    res.status(200).json({ success: true });
  });
  
  // Protected admin routes - only accessible to authenticated admins
  app.get("/api/admin/rsvps", isAuthenticated, async (req, res) => {
    try {
      const rsvps = await storage.getRsvps();
      res.json(rsvps);
    } catch (error: unknown) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({
        message: "Failed to retrieve RSVPs",
      });
    }
  });
  
  // Admin route to get guest messages (including unapproved ones)
  app.get("/api/admin/guest-messages", isAuthenticated, async (req, res) => {
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
  
  // Guest message approval
  app.put("/api/admin/guest-messages/:id/approve", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { approved } = req.body;
      
      const updatedMessage = await storage.updateGuestMessageApproval(id, approved);
      
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json({
        message: `Message ${approved ? 'approved' : 'unapproved'} successfully`,
        data: updatedMessage
      });
    } catch (error) {
      console.error("Error updating message approval:", error);
      res.status(500).json({ message: "Failed to update message approval" });
    }
  });
  
  // Delete guest message
  app.delete("/api/admin/guest-messages/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGuestMessage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Message not found or could not be deleted" });
      }
      
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });
  
  // Music Endpoints
  
  // Get the currently active music track (public)
  app.get("/api/music/active", async (req, res) => {
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
  
  // Admin music endpoints
  
  // Get all music tracks
  app.get("/api/admin/music", isAuthenticated, async (req, res) => {
    try {
      const tracks = await storage.getMusicTracks();
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching music tracks:", error);
      res.status(500).json({ message: "Failed to fetch music tracks" });
    }
  });
  
  // Upload a new music track
  app.post("/api/admin/music", isAuthenticated, musicUpload.single('musicFile'), async (req, res) => {
    try {
      let filePath = undefined;
      
      // A music file must be uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No music file provided" });
      }
      
      // Save the music file
      filePath = await storage.saveMusicAndGetUrl(req.file);
      
      // Combine form data with the file path
      const trackData = {
        title: req.body.title,
        artist: req.body.artist || null,
        filePath,
        isActive: req.body.isActive === 'true'
      };
      
      // Validate the data
      const validatedData = musicTrackFormSchema.parse(trackData);
      
      // Save the track
      const track = await storage.createMusicTrack(validatedData);
      
      res.status(201).json({
        message: "Music track uploaded successfully",
        data: track
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({
          message: "Validation failed",
          errors: (error as any).errors,
        });
      }
      
      if (error instanceof Error && error.name === "MulterError") {
        return res.status(400).json({ message: error.message });
      }
      
      console.error("Error uploading music track:", error);
      res.status(500).json({ message: "Failed to upload music track" });
    }
  });
  
  // Set active music track
  app.put("/api/admin/music/:id/active", isAuthenticated, async (req, res) => {
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
  
  // Delete music track
  app.delete("/api/admin/music/:id", isAuthenticated, async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
