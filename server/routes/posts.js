import express from "express";
import { ObjectId } from "mongodb";
import { connectToMongo } from "../db/connection.js";

const db = await connectToMongo();


const posts = express.Router();

posts.get("/", async (req, res) => {
  try {
    const posts = await db
      .collection("posts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).send(posts);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch posts" });
  }
});

posts.post("/", async (req, res) => {
  try {
    const newPost = req.body;
    const result = await db.collection("posts").insertOne(newPost);
    res.status(201).send({ ...newPost, _id: result.insertedId });
  } catch (err) {
    res.status(500).send({ error: "Failed to create post" });
  }
});

posts.get("/:id", async (req, res) => {
  try {
    const post = await db.collection("posts").findOne({ _id: req.params.id });
    if (!post) return res.status(404).send({ error: "Post not found" });
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch post" });
  }
});


posts.put("/:id", async (req, res) => {
  try {
    const result = await db
      .collection("posts")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Post not found" });
    }

    const updatedPost = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(req.params.id) });

    res.status(200).send(updatedPost);
  } catch (err) {
    res.status(500).send({ error: "Failed to update post" });
  }
});


posts.delete("/:id", async (req, res) => {
  try {
    const result = await db
      .collection("posts")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Post not found" });
    }
    res.status(200).send({ message: "Post deleted" });
  } catch (err) {
    res.status(500).send({ error: "Failed to delete post" });
  }
});

posts.get("/user/:id", async (req, res) => {
  try {
    const posts = await db
      .collection("posts")
      .find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).send(posts);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch posts" });
  }
});

export default posts;


