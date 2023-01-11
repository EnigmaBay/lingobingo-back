const mongoose = require("mongoose");

const lingowordSchema = new mongoose.Schema({
  // mongoose sets its own _id
  category: {
    type: String,
    min: 2,
    max: 30,
  },
  word: {
    type: String,
    min: 2,
    max: 30,
  },
  owner: {
    type: String,
    min: 12,
    max: 100,
  }, // will match a user id with this word and category
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false, // set to true when item is deleted
  },
});

const LingoWord = mongoose.model("LingoWords", lingowordSchema);

module.exports = LingoWord;
