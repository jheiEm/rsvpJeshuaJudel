import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRsvpSchema, rsvpFormSchema } from "@shared/schema";

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
      
      // Create the RSVP in storage
      const rsvp = await storage.createRsvp({
        ...validatedData,
        createdAt: new Date().toISOString(),
      });
      
      // Return the created RSVP
      res.status(201).json({
        message: "RSVP submitted successfully",
        rsvp,
      });
    } catch (error) {
      if (error.name === "ZodError") {
        // Handle validation errors
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      
      // Handle other errors
      console.error("Error creating RSVP:", error);
      res.status(500).json({
        message: "Failed to submit RSVP. Please try again later.",
      });
    }
  });

  // Get all RSVPs
  app.get("/api/rsvps", async (req, res) => {
    try {
      const rsvps = await storage.getRsvps();
      res.json(rsvps);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({
        message: "Failed to retrieve RSVPs",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
