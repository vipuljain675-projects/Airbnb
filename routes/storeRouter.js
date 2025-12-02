const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router.get("/", storeController.getIndex);
router.get("/homes", storeController.getHomeList);
router.get("/bookings", storeController.getBookings); // This handles showing the list
router.get("/favourites", storeController.getFavouriteList);
router.get("/homes/:homeId", storeController.getHomeDetails);
router.get("/reserve/:homeId", storeController.getReserve);

// ✅ ADD THIS LINE:
router.post("/bookings", storeController.postBooking); // This handles the "Reserve Now" button click

module.exports = router;