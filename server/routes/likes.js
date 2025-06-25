import express from "express";
import { ObjectId } from "mongodb";
import { connectToMongo } from "../db/connection.js";

const db = await connectToMongo();


const likes = express.Router();

likes.get("/:postId", async (req, res) => {
  try {
    const likes = await db
      .collection("likes")
      .find({ postId: req.params.postId })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).send(likes);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch likes" });
  }
});

likes.post("/:postId", async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  if (!userId || !postId) {
    return res.status(400).send({ error: "Missing postId or userId" });
  }

  try {
    const existingLike = await db.collection("likes").findOne({
      postId,
      userId,
    });

    if (existingLike) {
      await db.collection("likes").deleteOne({ _id: new ObjectId(existingLike._id) });
      return res.status(200).send({ message: "Like removed" });
    }

    const newLike = {
      postId,
      userId,
      createdAt: new Date(),
    };

    const result = await db.collection("likes").insertOne(newLike);
    res.status(201).send({ ...newLike, _id: result.insertedId });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).send({ error: "Failed to toggle like" });
  }
});

likes.get("/:postId/:userId", async (req, res) => {
  try {
    const like = await db
      .collection("likes")
      .findOne({ postId: req.params.postId, userId: req.params.userId });
    res.status(200).send(like);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch like" });
  }
});


export default likes;
