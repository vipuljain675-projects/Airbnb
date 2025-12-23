const express = require("express");
const hostController = require("../controllers/hostController");
const path = require("path");
const multer = require("multer"); // 1. Import Multer

const router = express.Router();

// 2. Configure Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Rename file: 2025-12-23-myimage.png
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// 3. Initialize Multer
const upload = multer({ storage: storage });

// 4. Routes
router.get("/add-home", hostController.getAddHome);

// 👇 Apply middleware to routes that accept files
router.post("/add-home", upload.single("photo"), hostController.postAddHome);

router.get("/host-home-list", hostController.getHostHomes);

router.get("/edit-home/:homeId", hostController.getEditHome);
router.post("/edit-home", upload.single("photo"), hostController.postEditHome);

router.post("/delete-home/:homeId", hostController.postDeleteHome);

module.exports = { router };