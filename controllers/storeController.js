const Home = require("../models/home");
const Booking = require("../models/booking");

exports.getIndex = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("store/index", {
      pageTitle: "Airbnb | Holiday Rentals",
      currentPage: "index",
      registeredHomes: registeredHomes,
    });
  });
};

exports.getHomeList = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("store/home-list", {
      pageTitle: "Homes List",
      currentPage: "home-list",
      registeredHomes: registeredHomes,
    });
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.fetchAll((homes) => {
    // Find the specific home by name (assuming name is unique for now)
    const home = homes.find((h) => h.houseName === homeId);
    
    if (!home) {
        return res.redirect("/homes");
    }

    res.render("store/home-detail", {
      pageTitle: "Home Detail",
      currentPage: "home-list",
      home: home,
    });
  });
};

exports.getBookings = (req, res, next) => {
  Booking.fetchAll((bookings) => {
    res.render("store/bookings", {
      pageTitle: "My Bookings",
      currentPage: "bookings",
      bookings: bookings,
    });
  });
};

exports.getFavouriteList = (req, res, next) => {
  res.render("store/favourite-list", {
    pageTitle: "My Favourites",
    currentPage: "favourites",
  });
};

exports.getReserve = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.fetchAll((homes) => {
    const home = homes.find((h) => h.houseName === homeId);
    
    if (!home) {
        return res.redirect("/homes");
    }

    res.render("store/reserve", {
      pageTitle: "Confirm Booking",
      currentPage: "home-list",
      homeId: homeId,
      home: home, // Pass the full home object to the view
    });
  });
};

exports.postBooking = (req, res, next) => {
  const { 
    homeId, 
    homeName, 
    pricePerNight, 
    checkIn, 
    checkOut,
    firstName,
    lastName,
    phone,
    email,
    guests 
  } = req.body;

  // 1. Calculate Nights
  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days

  // 2. Calculate Total Price
  const totalPrice = diffDays * pricePerNight;

  // 3. Save Booking with ALL details
  const booking = new Booking(
    homeId,
    homeName,
    checkIn,
    checkOut,
    totalPrice,
    firstName,
    lastName,
    phone,
    email,
    guests
  );
  
  booking.save();
  
  // 4. Redirect to the receipt page
  res.redirect("/bookings");
};