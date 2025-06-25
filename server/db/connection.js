// db/connection.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("❌ MONGO_URI is not defined in .env");
}

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
});

let db;

async function connectToMongo() {
  try {
    await client.connect();
    db = client.db("social");
    console.log("✅ Connected to MongoDB");
  } catch (e) {
    console.error("❌ Failed to connect to MongoDB:", e);
    process.exit(1);
  }
}

await connectToMongo();

export default () => db;
