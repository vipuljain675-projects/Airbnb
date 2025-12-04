const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");

module.exports = class Booking {
  constructor(homeId, homeName, startDate, endDate, totalPrice, firstName, lastName, phone, email, guests) {
    this.homeId = homeId;
    this.homeName = homeName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalPrice = totalPrice;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
    this.guests = guests;
    
    // ✅ NEW: Generate a Unique "Ticket Number" (ID)
    this.id = Math.random().toString(); 
  }

  save() {
    Booking.fetchAll((bookings) => {
      bookings.push(this);
      const bookingPath = path.join(rootDir, "data", "bookings.json");
      fs.writeFile(bookingPath, JSON.stringify(bookings), (err) => {
        if (err) console.log("Error saving booking:", err);
      });
    });
  }

  static fetchAll(callback) {
    const bookingPath = path.join(rootDir, "data", "bookings.json");
    fs.readFile(bookingPath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  }

  // ✅ NEW: Delete Logic (Cancellation)
  static deleteById(bookingId, callback) {
    Booking.fetchAll((bookings) => {
      // Filter out the booking we want to cancel
      const updatedBookings = bookings.filter((b) => b.id !== bookingId);
      
      const bookingPath = path.join(rootDir, "data", "bookings.json");
      fs.writeFile(bookingPath, JSON.stringify(updatedBookings), (err) => {
        if (!err) callback();
      });
    });
  }
};