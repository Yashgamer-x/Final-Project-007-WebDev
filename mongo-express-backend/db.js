// Import the official MongoDB Node.js driver
import { MongoClient } from "mongodb";

// Import dotenv so we can load environment variables from .env
import dotenv from "dotenv";
dotenv.config(); // Load variables like MONGO_URI and DB_NAME

/**
 * Create a new MongoClient instance using the connection string
 * from your .env file.
 *
 * MongoClient is the main entry point for working with MongoDB
 * from Node.js.
 */
const client = new MongoClient(process.env.MONGO_URI);

/**
 * We store the database connection here once it's created.
 * This prevents reconnecting on every request (which is slow).
 *
 * Instead, the first call connects, and all future calls reuse
 * the same connection.
 */
let dbInstance = null;

/**
 * getDB()
 * ----------
 * Connects to MongoDB Atlas (if not already connected)
 * and returns the database instance.
 *
 * This function ensures:
 * 1. Only one connection is ever established (efficient)
 * 2. Other files can call getDB() to quickly get the DB
 */
export async function getDB() {
  // If already connected, reuse the existing connection
  if (dbInstance) return dbInstance;

  try {
    // Open a connection to MongoDB Atlas
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    /**
     * Choose the database name:
     * - Prefer DB_NAME from .env
     * - Otherwise default to "Library"
     */
    dbInstance = client.db(process.env.DB_NAME || "007");

    // Return the connected database object
    return dbInstance;
  } catch (err) {
    // Log the actual error for debugging
    console.error("MongoDB connection error:", err);

    // Throw error so that Express routes can handle it properly
    throw err;
  }
}
