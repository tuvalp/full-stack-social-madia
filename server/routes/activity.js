import express from "express";
import { ObjectId } from "mongodb";
import { connectToMongo } from "../db/connection.js";

const db = await connectToMongo();


const activitys = express.Router();

activitys.get("/:targetUserId", async (req, res) => {
  try {
    const activities = await db
      .collection("activitys")
      .find({ targetUserId: req.params.targetUserId }) 
      .sort({ timestamp: -1 }) 
      .limit(7)
      .toArray();
    res.status(200).send(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).send({ error: "Failed to fetch activities" });
  }
});


activitys.post("/", async (req, res) => {
  try {
    const result = await db.collection("activitys").insertOne(req.body);
    res.status(201).send({ ...req.body, _id: result.insertedId });
  } catch (err) {
    console.error("Error logging activity", err);
    res.status(500).send({ error: "Failed to log activity" });
  }
});

activitys.put("/:id", async (req, res) => {
  try {
    const result = await db
      .collection("activitys")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { read: true } });

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Activity not found" });
    }

    res.status(200).send({ message: "Activity marked as read" });
  } catch (err) {
    res.status(500).send({ error: "Failed to update activity" });
  }
});

export default activitys;
