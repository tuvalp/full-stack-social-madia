import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const comments = express.Router();

comments.get("/:postId", async (req, res) => {
  try {
    const comments = await db
      .collection("comments")
      .find({ postId: req.params.postId })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).send(comments);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch comments" });
  }
});

comments.post("/", async (req, res) => {
  try {
    const newComment = req.body;
    const result = await db.collection("comments").insertOne(newComment);
    res.status(201).send({ ...newComment, _id: result.insertedId });
  } catch (err) {
    res.status(500).send({ error: "Failed to create comment" });
  }
});

comments.get("/:id", async (req, res) => {
  try {
    const comment = await db.collection("comments").findOne({ id: req.params.id });
    if (!comment) return res.status(404).send({ error: "Comment not found" });
    res.status(200).send(comment);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch comment" });
  }
});

comments.put("/:id", async (req, res) => {
  try {
    const result = await db
      .collection("comments")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Comment not found" });
    }
    res.status(200).send({ message: "Comment updated" });
  } catch (err) {
    res.status(500).send({ error: "Failed to update comment" });
  }
});

comments.delete("/:id", async (req, res) => {
  try {
    const result = await db
      .collection("comments")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Comment not found" });
    }
    res.status(200).send({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).send({ error: "Failed to delete comment" });
  }
});


export default comments;


