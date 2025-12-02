const express = require("express");
const router = express.Router();
const hostController = require("../controllers/hostController");

// 1. Add Home (Form & Submit)
router.get("/add-home", hostController.getAddHome);
router.post("/add-home", hostController.postAddHome);

// 2. Host Dashboard (List of homes)
router.get("/host-home-list", hostController.getHostHomes);

// 3. Edit Home (✅ UPDATED: Added /:homeId to capture the ID)
router.get("/edit-home/:homeId", hostController.getEditHome);

// 4. Delete Home (✅ UPDATED: Handles the POST request from the delete button)
router.post("/delete-home", hostController.postDeleteHome);

exports.router = router;