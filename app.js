const path = require("path");
const express = require("express");
const storeRouter = require("./routes/storeRouter");
const { router: hostRouter } = require("./routes/hostRouter");
const errorsController = require("./controllers/errorsController");
const mongoConnect = require('./utils/databaseUtils').mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

// 1. Serve Static CSS/JS from 'public'
app.use(express.static(path.join(__dirname, "public")));

// 2. 👇 NEW: Serve Uploaded Images from 'uploads'
// This creates a tunnel: URLs starting with /uploads will look inside the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(storeRouter);
app.use("/host", hostRouter);

app.use(errorsController.pageNotFound);

const PORT = 3600;

mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});