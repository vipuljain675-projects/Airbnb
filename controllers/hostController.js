const Home = require('../models/home');

exports.getHostDashboard = (req, res) => {
  if (!req.user) return res.redirect('/login');

  Home.find({ userId: req.user._id })
    .then(homes => {
      if (homes.length === 0) {
        return res.redirect('/host/add-home');
      }
      res.redirect('/host/host-home-list');
    });
};

exports.getAddHome = (req, res) => {
  res.render('host/edit-home', {
    pageTitle: 'Add Home',
    editing: false,
    home: {}
  });
};

exports.postAddHome = (req, res) => {
  const { houseName, price, location, rating, description } = req.body;

  const imageUrls = req.files.map(file => '/' + file.path);

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    description,
    photoUrl: imageUrls,
    userId: req.user._id
  });

  home.save().then(() => res.redirect('/host/host-home-list'));
};

exports.getHostHomes = (req, res) => {
  Home.find({ userId: req.user._id })
    .then(homes => {
      res.render('host/host-home-list', {
        pageTitle: 'Your Listings',
        homes
      });
    });
};

exports.getEditHome = (req, res) => {
  Home.findById(req.params.homeId)
    .then(home => {
      res.render('host/edit-home', {
        pageTitle: 'Edit Home',
        editing: true,
        home
      });
    });
};

exports.postEditHome = (req, res) => {
  const { id, houseName, price, location, rating, description } = req.body;

  Home.findById(id).then(home => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    if (req.files.length > 0) {
      home.photoUrl = req.files.map(file => '/' + file.path);
    }

    return home.save();
  }).then(() => res.redirect('/host/host-home-list'));
};

exports.postDeleteHome = (req, res) => {
  Home.findByIdAndDelete(req.params.homeId)
    .then(() => res.redirect('/host/host-home-list'));
};
