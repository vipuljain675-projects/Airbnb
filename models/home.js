const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");

module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    // ✅ 1. Generate unique ID
    this.id = Math.random().toString(); 
  }

  save() {
    Home.fetchAll((registeredHomes) => {
      registeredHomes.push(this);
      const homeDataPath = path.join(rootDir, "data", "homes.json");
      fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), (error) => {
        if(error) console.log("Error saving home", error);
      });
    });
  }

  static fetchAll(callback) {
    const homeDataPath = path.join(rootDir, "data", "homes.json");
    fs.readFile(homeDataPath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  }

  // ✅ 2. Find a specific home for Editing
  static findById(homeId, callback) {
    Home.fetchAll(homes => {
      const home = homes.find(h => h.id === homeId);
      callback(home);
    });
  }

  // ✅ 3. Delete a specific home
  static deleteById(homeId, callback) {
    Home.fetchAll(homes => {
      // Keep every home EXCEPT the one we want to delete
      const updatedHomes = homes.filter(h => h.id !== homeId);
      
      const homeDataPath = path.join(rootDir, "data", "homes.json");
      fs.writeFile(homeDataPath, JSON.stringify(updatedHomes), (error) => {
        if (!error) {
            callback();
        }
      });
    });
  }
};