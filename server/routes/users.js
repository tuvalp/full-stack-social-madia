import express from "express";
import { ObjectId } from "mongodb";
import { connectToMongo } from "../db/connection.js";

const db = await connectToMongo();



const users = express.Router();

users.get("/login", async (req, res) => {
  try {
    const user = await db
      .collection("users")
      .findOne({ email: req.query.email });
    if (!user) return res.status(404).send({ error: "Invalid Email" });
    if (user.password !== req.query.password)
      return res.status(404).send({ error: "Invalid Password" });

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ error: "Failed to find user" });
  }
});

users.post("/register", async (req, res) => {
  try {
    if (await db.collection("users").findOne({ email: req.body.email }))
      return res.status(404).send({ error: "Email already registered" });

    const newUser = req.body;
    const result = await db.collection("users").insertOne(newUser);
    res.status(201).send({ ...newUser, _id: result.insertedId });
  } catch (err) {
    res.status(500).send({ error: "Failed to register user" });
  }
});

users.put("/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    // Check for duplicate email (excluding current user)
    if (req.body.email) {
      const existingUser = await db.collection("users").findOne({
        email: req.body.email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).send({ error: "Email already registered" });
      }
    }

    // Update the user
    const result = await db
      .collection("users")
      .updateOne({ _id: userId }, { $set: req.body });

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "User not found" });
    }

    // Send back the updated user
    const updatedUser = await db
      .collection("users")
      .findOne({ _id: userId });

    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send({ error: "Failed to update user" });
  }
});


users.delete("/:id", async (req, res) => {
  try {
    const result = await db
      .collection("users")
      .deleteOne({ id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).send({ message: "User deleted" });
  } catch (err) {
    res.status(500).send({ error: "Failed to delete User" });
  }
});

users.get("/:id", async (req, res) => {
  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

export default users;
