const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  homeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true },
  homeName: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);