import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRsvpSchema, rsvpFormSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
