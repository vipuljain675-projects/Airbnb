const Home = require("../models/home");
const Booking = require("../models/booking");
const Favourite = require("../models/favourite");

/* =========================
   HOME / INDEX
========================= */

exports.getIndex = (req, res) => {
  res.render("store/index", {
    pageTitle: "Airbnb | Welcome",
    currentPage: "index",
  });
};

exports.getHomeList = (req, res) => {
  Home.find()
    .then((homes) => {
      console.log("HOMES FROM DB:", homes); // 👈 ADD THIS LINE

      res.render("store/home-list", {
        pageTitle: "Explore Homes",
        currentPage: "home-list",
        homes,
        isSearch: false,
      });
    })
    .catch(err => console.log(err));
};


/* =========================
   SEARCH (SINGLE, CLEAN)
========================= */

exports.getSearch = (req, res) => {
  const query = req.query.q;

  Home.find({
    $or: [
      { houseName: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } }
    ]
  })
    .then(homes => {
      res.render("store/home-list", {
        pageTitle: `Search results for "${query}"`,
        currentPage: "home-list",
        homes,
        isSearch: true,
      });
    })
    .catch(err => console.log(err));
};

/* =========================
   HOME DETAILS
========================= */

exports.getHomeDetails = (req, res) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .populate("userId") // 🟢 THIS IS THE KEY CHANGE
    .then(home => {
      if (!home) return res.redirect("/homes");

      res.render("store/home-detail", {
        pageTitle: home.houseName,
        currentPage: "home-list",
        home,
      });
    })
    .catch(err => console.log(err));
};
/* =========================
   FAVOURITES
========================= */
exports.getFavouriteList = (req, res) => {
  Favourite.find({ userId: req.user._id })
    .populate("homeId")
    .then(favourites => {
      // 🟢 FIX: Filter out any homes that might have been deleted
      // We only keep 'f' if 'f.homeId' is NOT null
      const homes = favourites
        .map(f => f.homeId)
        .filter(home => home !== null);

      res.render("store/favourite-list", {
        pageTitle: "My Favourites",
        currentPage: "favourites",
        favouriteHomes: homes
      });
    })
    .catch(err => console.log(err));
};

exports.postAddToFavourite = (req, res) => {
  const homeId = req.body.homeId;
  const userId = req.user._id;

  Favourite.findOne({ homeId, userId })
    .then(existingFav => {
      if (existingFav) {
        // Already favourited → just redirect
        return res.redirect("/favourite-list");
      }

      const fav = new Favourite({ homeId, userId });
      return fav.save();
    })
    .then(() => {
      res.redirect("/favourite-list");
    })
    .catch(err => console.log(err));
};



exports.postRemoveFavourite = (req, res) => {
  const homeId = req.body.homeId;

  Favourite.findOneAndDelete({
    homeId,
    userId: req.user._id
  })
    .then(() => res.redirect("/favourite-list"))
    .catch(err => console.log(err));
};


/* =========================
   BOOKINGS
========================= */

exports.getBookings = (req, res) => {
  Booking.find({ userId: req.user._id })
    // 👇 ADD THIS LINE to get the real photoUrl
    .populate('homeId') 
    .then(bookings => {
        res.render("store/bookings", {
            pageTitle: "My Bookings",
            currentPage: "bookings",
            bookings,
        });
    })
    .catch(err => console.log(err));
};
exports.getReserve = (req, res) => {
  Home.findById(req.params.homeId)
    .then(home => {
      if (!home) return res.redirect("/homes");

      res.render("store/reserve", {
        pageTitle: "Confirm Booking",
        currentPage: "home-list",
        home,
      });
    })
    .catch(err => console.log(err));
};

exports.postBooking = (req, res, next) => {
  const { homeId, checkIn, checkOut } = req.body;

  const newCheckIn = new Date(checkIn);
  const newCheckOut = new Date(checkOut);

  // 1. COLLISION CHECK (Keep this logic)
  Booking.find({
    homeId: homeId,
    $or: [
      { checkIn: { $lte: newCheckIn }, checkOut: { $gte: newCheckIn } },
      { checkIn: { $lte: newCheckOut }, checkOut: { $gte: newCheckOut } },
      { checkIn: { $gte: newCheckIn }, checkOut: { $lte: newCheckOut } }
    ]
  })
  .then(existingBookings => {
    if (existingBookings.length > 0) {
      return res.render("store/booking-failed", {
        pageTitle: "Dates Unavailable",
        currentPage: "bookings",
        homeId: homeId
      });
    }

    // 2. FETCH HOME & CALCULATE BILL
    return Home.findById(homeId)
      .then(home => {
        // 🟢 MATH TIME: Calculate nights
        const differenceInTime = newCheckOut.getTime() - newCheckIn.getTime();
        // Convert milliseconds to days (1000ms * 60s * 60m * 24h)
        const nights = Math.ceil(differenceInTime / (1000 * 3600 * 24)); 
        
        // 🟢 Calculate Total Price
        const totalPrice = nights * home.price;

        const newBooking = new Booking({
          homeId: homeId,
          userId: req.user._id,
          checkIn: newCheckIn,
          checkOut: newCheckOut,
          
          // 🟢 FIX: Add the missing fields required by your Model
          homeName: home.houseName, 
          totalPrice: totalPrice,
          price: home.price 
        });
        
        return newBooking.save();
      })
      .then(() => {
        res.redirect("/bookings");
      });
  })
  .catch(err => console.log(err));
};
// ... keep your other exports like getHomeDetails, etc.
exports.postCancelBooking = (req, res) => {
  Booking.findByIdAndDelete(req.body.bookingId)
    .then(() => res.redirect("/bookings"))
    .catch(err => console.log(err));
};
