// Import core dependencies
import express, { json } from "express";   // Web framework for building API routes
import cors from "cors";        // Enables cross-origin requests (Vue → Express)
import { getDB } from "./db.js"; // Custom function to connect to MongoDB Atlas
import dotenv from "dotenv";     // Loads environment variables from .env
import { ObjectId } from "mongodb";
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
  res.redirect("https://web-app-assignment-2.onrender.com/");
});


app.get("/api/films", async (req, res) => {
  try {
    // Connect to MongoDB (cached connection in db.js)
    const db = await getDB();
    // Lookup, From actors collection, field is actors from Movies, the foreign field _id, and returns the results as actorDetails
    const films = await db.collection("Movies").aggregate([
      {
        $lookup: {
          from: "Actors",
          localField: "actors",
          foreignField: "_id",
          as: "actorDetails"
        }
      }
    ]).toArray();

    // Send JSON response back to frontend
    res.json(films);
  } catch (err) {
    // Log errors to backend console
    console.error("Error fetching items:", err);

    // Send generic error to frontend
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api", async (req, res) =>{
  try {
    const db = await getDB();

    const filmCollection = db.collection("Movies");
    const actorCollection = db.collection("Actors");

    const films = await filmCollection.find().toArray();
    const actors = await actorCollection.find().toArray();

    res.json({
      films: films,
      actors: actors
    });

  } catch (err) {
    console.log("error:", err);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.post("/api/add/film", async (req, res) => {
  try {
    const db = await getDB();
    const filmCollection = db.collection("Movies");
    const film = req.body;
    const filmActors = film.actors;
    const actorCollection = db.collection("Actors");
    const matchingActors = await actorCollection
    .find({ name: { $in: filmActors } })
    .toArray();
    const actorsObjectId = matchingActors.map(actor => actor._id);
    const result = await filmCollection.insertOne({
      name: film.name,
      description: film.description,
      releaseDate: new Date(film.releaseDate),
      imageurl: film.imageurl,
      actors: actorsObjectId
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

app.delete("/api/film", async (req, res) => {
  try {
    const db = await getDB();
    const film = req.body;

    if (!film || !film._id) {
      return res.status(400).json({ error: "Missing film ID" });
    }

    const filmId = ObjectId.createFromHexString(film._id);
    const result = await db.collection("Movies").deleteOne({ _id: filmId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Film not found" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting film:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/actor/:id", async (req, res) => {
  try {
    const actorId = req.params.id;
    if (!ObjectId.isValid(actorId)) {
      return res.status(400).json({ error: "Invalid actor ID format" });
    }
    const db = await getDB();
    const actorCollection = db.collection("Actors");
    const actor = await actorCollection.findOne({ _id: new ObjectId(actorId) });

    if (!actor) {
      return res.status(404).json({ error: "Actor not found" });
    }
    res.json(actor);

  } catch (err) {
    console.error("Error fetching actor by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/actors", async (req, res) => {
  try {
    // Connect to MongoDB (cached connection in db.js)
    const db = await getDB();

    // Fetch all documents from the "Books" collection
    const items = await db.collection("Actors").find().toArray();

    // Send JSON response back to frontend
    res.json(items);
  } catch (err) {
    // Log errors to backend console
    console.error("Error fetching items:", err);

    // Send generic error to frontend
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/add/actor", async (req, res) => {
  try {
    const db = await getDB();
    const actorCollection = db.collection("Actors");

    const actor = req.body;

    const result = await actorCollection.insertOne({
      name: actor.name,
      age: actor.age,
      imageurl: actor.imageurl
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
