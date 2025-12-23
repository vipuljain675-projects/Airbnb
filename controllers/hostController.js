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
  const files = req.files; 

  let photoUrls = [];
  if (files && files.length > 0) {
    photoUrls = files.map(file => "/" + file.path);
  } else {
    photoUrls = ["https://placehold.co/600x400"];
  }

  const home = new Home({
    houseName, price, location, rating, photoUrl: photoUrls, description
  });
  
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
  const { id, houseName, price, location, rating, description, oldPhotoUrls } = req.body;
  const files = req.files;

  let photoUrls;
  if (files && files.length > 0) {
    photoUrls = files.map(file => "/" + file.path);
  } else {
    photoUrls = oldPhotoUrls ? oldPhotoUrls.split(',') : [];
  }

  Home.findByIdAndUpdate(id, {
    houseName, price, location, rating, photoUrl: photoUrls, description
  })
    .then(() => res.redirect("/host/host-home-list"))
    .catch((err) => console.log(err));
};

exports.postDeleteHome = (req, res, next) => {
  Home.findByIdAndDelete(req.params.homeId)
    .then(() => res.redirect("/host/host-home-list"))
    .catch((err) => console.log(err));
};

exports.getHostHomes = (req, res, next) => {
  Home.find()
    .then((homes) => {
      res.render("host/host-home-list", {
        pageTitle: "Host Homes",
        currentPage: "host-homes",
        homes: homes,
      });
    })
    .catch((err) => console.log(err));
};