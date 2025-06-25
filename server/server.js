import express from "express";
import cors from "cors";

import users from "./routes/users.js";
import posts from "./routes/posts.js";
import comments from "./routes/comments.js";
import likes from "./routes/likes.js";
import activitys from "./routes/activity.js";
import uploadRouter from "./routes/upload.js";


const port = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));


app.use("/users", users);
app.use("/posts", posts);
app.use("/comments", comments);
app.use("/likes", likes);
app.use("/activitys", activitys);
app.use("/upload", uploadRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});