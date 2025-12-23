const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homeSchema = new Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  photoUrl: [String], // Array of strings
  description: { type: String, required: true }
});

module.exports = mongoose.model('Home', homeSchema);