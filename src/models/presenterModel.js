const mongoose = require("mongoose");

const presenterSchema = new mongoose.Schema({
  uuid: {
    type: String, // calculated from name + email + locale
    required: [true, "Not authenticated"],
    min: 12,
    max: 100,
  },
  bingoboards: {
    type: [String],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false, // set to true when item is deleted
  },
});

const Presenter = mongoose.model("Presenter", presenterSchema);

module.exports = Presenter;
