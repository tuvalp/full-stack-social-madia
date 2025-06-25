import express from "express";
import multer from "multer";
import path from "path";

// Setup storage (optional but cleaner)
const storageImage = multer.diskStorage({
  destination: "uploads/images",
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const storageProfile = multer.diskStorage({
  destination: "uploads/profile",
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});


const uploadImg = multer({ storage: storageImage });
const uploadProfile = multer({ storage: storageProfile });


const uploadRouter = express.Router();

uploadRouter.post("/img", uploadImg.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded",
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/images/${req.file.filename}`, 
    },
  });
});

uploadRouter.post("/profile", uploadProfile.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded",
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/profile/${req.file.filename}`,
    },
  });
});


export default uploadRouter;
