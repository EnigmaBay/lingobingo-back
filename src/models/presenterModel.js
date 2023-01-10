const mongoose = require("mongoose");

const presenterSchema = new mongoose.Schema({
  uuid: {
    type: String,
    min: 12,
    max: 100,
  }, // calculated from name + email + locale
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
  deleted: {
    type: Boolean,
    default: false, // set to true when item is deleted
  },
});

const Presenter = mongoose.model("Presenter", presenterSchema);

module.exports = Presenter;
