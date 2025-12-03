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
    this.id = Math.random().toString();
  }

  save() {
    Home.fetchAll((registeredHomes) => {
      registeredHomes.push(this);
      const homeDataPath = path.join(rootDir, "data", "homes.json");
      fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), (error) => {
        if (error) console.log("Error saving home", error);
      });
    });
  }

  static fetchAll(callback) {
    const homeDataPath = path.join(rootDir, "data", "homes.json");
    fs.readFile(homeDataPath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  }

  static findById(homeId, callback) {
    Home.fetchAll((homes) => {
      const home = homes.find((h) => h.id === homeId);
      callback(home);
    });
  }

  static updateById(homeId, updatedInfo, callback) {
    Home.fetchAll((homes) => {
      const homeIndex = homes.findIndex((h) => h.id === homeId);
      if (homeIndex > -1) {
        const updatedHome = new Home(
          updatedInfo.houseName,
          updatedInfo.price,
          updatedInfo.location,
          updatedInfo.rating,
          updatedInfo.photoUrl
        );
        updatedHome.id = homeId;
        homes[homeIndex] = updatedHome;
        const homeDataPath = path.join(rootDir, "data", "homes.json");
        fs.writeFile(homeDataPath, JSON.stringify(homes), (error) => {
          if (!error) callback();
        });
      } else {
        callback();
      }
    });
  }

  static deleteById(homeId, callback) {
    Home.fetchAll((homes) => {
      const updatedHomes = homes.filter((h) => h.id !== homeId);
      const homeDataPath = path.join(rootDir, "data", "homes.json");
      fs.writeFile(homeDataPath, JSON.stringify(updatedHomes), (error) => {
        if (!error) callback();
      });
    });
  }

  // ✅ NEW: Search Logic
  static search(query, callback) {
    Home.fetchAll((homes) => {
      const results = homes.filter(home => {
          const lowerLocation = home.location.toLowerCase();
          const lowerTitle = home.houseName.toLowerCase();
          const lowerQuery = query.toLowerCase();
          return lowerLocation.includes(lowerQuery) || lowerTitle.includes(lowerQuery);
      });
      callback(results);
    });
  }
};