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
app.use(express.static(path.join(__dirname, "public")));

// 👇 IMPORTANT: Allow browser to access uploaded images
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