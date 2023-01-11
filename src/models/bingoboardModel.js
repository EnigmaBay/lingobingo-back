const mongoose = require("mongoose");

const bingoboardSchema = new mongoose.Schema({
  uuid: {
    type: String, // calculated bingoboard uuid
    required: [true, "Not authenticated"],
    min: 12,
    max: 100,
  },
  owner: String, // owner uuid
  category: String, // category of this bingoboard
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

const BingoBoard = mongoose.model("Bingoboard", bingoboardSchema);

module.exports = BingoBoard;
