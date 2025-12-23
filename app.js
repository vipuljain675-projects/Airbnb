const path = require("path");
const express = require("express");
const mongoose = require("mongoose"); // 1. Import Mongoose
const storeRouter = require("./routes/storeRouter");
const { router: hostRouter } = require("./routes/hostRouter");
const errorsController = require("./controllers/errorsController");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Serve Uploaded Images so they can be seen in the browser
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(storeRouter);
app.use("/host", hostRouter);

app.use(errorsController.pageNotFound);

const PORT = 3500;

// 2. Connect to Mongoose (This handles the DB connection now)
// Note: 'airbnb' is the name of your database. Mongoose creates it if it doesn't exist.
const MONGO_URI = "mongodb://localhost:27017/airbnb";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`✅ Connected to MongoDB via Mongoose`);
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Mongoose Connection Error:", err);
  });