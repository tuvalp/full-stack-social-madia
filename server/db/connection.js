import { MongoClient, ServerApiVersion } from "mongodb";

//const uri = process.env.MONGODB_URI;
const uri = "mongodb+srv://tuvalpeled:tp4388@server.kyz40tm.mongodb.net/?retryWrites=true&w=majority&appName=Server";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
    },
});



try {
    await client.connect();
    console.log("Connected to MongoDB");
} catch (e) {
    console.error(e);
}

let db = client.db("social");
export default db;