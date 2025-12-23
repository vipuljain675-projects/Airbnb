const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "addHome",
    editing: false,
    home: null
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  if (!editing) return res.redirect("/host/host-home-list");

  Home.findById(homeId)
    .then((home) => {
      if (!home) return res.redirect("/");
      res.render("host/edit-home", {
        pageTitle: "Edit Home",
        currentPage: "host-homes",
        editing: editing,
        home: home,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  const image = req.file; // Captured by Multer

  // Construct path relative to root, e.g., "/uploads/123-house.jpg"
  const photoUrl = image ? "/" + image.path : "https://placehold.co/600x400"; 

  const home = new Home(houseName, price, location, rating, photoUrl, description);
  
  home.save()
    .then(() => {
      res.render("host/home-added", {
        pageTitle: "Listing Created",
        currentPage: "addHome"
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description, oldPhotoUrl } = req.body;
  const image = req.file;

  // Logic: Use new image path if uploaded, otherwise keep the old path
  const photoUrl = image ? "/" + image.path : oldPhotoUrl;

  const home = new Home(houseName, price, location, rating, photoUrl, description, id);
  home.save()
    .then(() => res.redirect("/host/host-home-list"))
    .catch((err) => console.log(err));
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.deleteById(homeId)
    .then(() => res.redirect("/host/host-home-list"))
    .catch((err) => console.log(err));
};

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll()
    .then((homes) => {
      res.render("host/host-home-list", {
        pageTitle: "Host Homes",
        currentPage: "host-homes",
        homes: homes,
      });
    })
    .catch((err) => console.log(err));
};