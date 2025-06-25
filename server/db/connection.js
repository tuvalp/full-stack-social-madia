import { MongoClient, ServerApiVersion } from "mongodb";

//const uri = process.env.MONGODB_URI;
const uri = "mongodb+srv://tuvalpeled:tp4388@server.kyz40tm.mongodb.net/?retryWrites=true&w=majority&appName=Server";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
  });



try {
    await client.connect();
    console.log("Connected to MongoDB");
} catch (e) {
    console.error(e);
}

let db = client.db("social");
export default db;