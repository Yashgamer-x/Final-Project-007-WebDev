// Import core dependencies
import express, { json } from "express";   // Web framework for building API routes
import cors from "cors";        // Enables cross-origin requests (Vue → Express)
import { getDB } from "./db.js"; // Custom function to connect to MongoDB Atlas
import dotenv from "dotenv";     // Loads environment variables from .env

// Load environment variables (PORT, MONGO_URI, etc.)
dotenv.config();

// Create Express application
const app = express();

// Set fallback port if PORT not found in .env
const PORT = process.env.PORT || 3000;

// ----------------------
// Middleware
// ----------------------

// Enable CORS so Vue frontend can call this backend
app.use(cors());

// Allows Express to read JSON request bodies (POST, PUT, etc.)
app.use(express.json());

// ----------------------
// Routes
// ----------------------

// Health check route (optional)
// Used to confirm the backend is running
app.get("/", (req, res) => {
  res.send("API is running!");
});

// GET /api/books
// Fetches all book documents from MongoDB Atlas
app.get("/api/films", async (req, res) => {
  try {
    // Connect to MongoDB (cached connection in db.js)
    const db = await getDB();

    // Fetch all documents from the "Books" collection
    const items = await db.collection("Movies").find().toArray();

    // Send JSON response back to frontend
    res.json(items);
  } catch (err) {
    // Log errors to backend console
    console.error("Error fetching items:", err);

    // Send generic error to frontend
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/add/film", async (req, res) => {
  try {
    const db = await getDB();
    const filmCollection = db.collection("Movies");

    const film = req.body;

    const result = await filmCollection.insertOne({
      name: film.name,
      description: film.description,
      releaseDate: new Date(film.releaseDate),
      imageurl: film.imageurl
    });

    return res.status(201).json({
      message: "Film added successfully",
      insertedId: result.insertedId
    });

  } catch (err) {
    console.error("Error Uploading items:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// ----------------------
// Start the Server
// ----------------------

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
