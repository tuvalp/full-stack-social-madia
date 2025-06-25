import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://tuvalpeled:tp4388@server.kyz40tm.mongodb.net/?retryWrites=true&w=majority&appName=Server";

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
    console.log("✅ Connected to MongoDB");
    db = client.db("social");
  } catch (e) {
    console.error("❌ Failed to connect to MongoDB:", e);
    process.exit(1); // optional: crash on connection failure
  }
}

await connectToMongo(); // works only in ESM

export default () => db;
