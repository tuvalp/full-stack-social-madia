import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("❌ MONGO_URI not set in .env");

const client = new MongoClient(uri); // no options needed

let db;

export async function connectToMongo() {
  if (db) return db;

  try {
    await client.connect();
    db = client.db(); // will use "social" from URI
    console.log("✅ Connected to MongoDB");
    return db;
  } catch (e) {
    console.error("❌ Failed to connect to MongoDB:", e);
    process.exit(1);
  }
}
