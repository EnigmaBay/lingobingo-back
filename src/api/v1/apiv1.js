const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const authorize = require('../../authorization/authorize');

mongoose.connect(process.env.MONGO_CONN_STRING);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongoose is connected.");
});

router.get("/", (req, res) => {
  res.status(501).json({ message: "api/v1/ not implemented." });
});

router.get("/authorize", (req, res) => {
  res.status(501).json({ message: "Unable to authorize at this time." });
});

router.get("/api/v1/protected", (req, res) => {
  console.log("query at /api/v1/proteted");
  res.status(200).json({ message: "protected path!" });
});

router.get("/words/:category", async (req, res, next) => {
  const category = req.params.category;
  // todo: when cookies implemented replace this with cookie validator
  const uuid = process.env.TEST_UUID;
  const getWords = require("../../route-handlers/get-words");

  if (!uuid || !category) {
    console.log("uuid and category were undefined", uuid, category);
    res.status(400).json({ message: "missing category in params." });
  } else {
    // todo: when cache enabled also send req.path to getWords func
    getWords(uuid, category)
      .then((wordList) => {
        res.status(200).send({ wordList });
      })
      .catch((error) => {
        // todo: fix this catch to not leak code details
        console.error(error);
        res.status(500).json({ error });
      });
  }
});

router.post("/word", async (req, res) => {
  const { category, word } = req.body;
  const uuid = process.env.TEST_UUID;

  if (!category || !word || !uuid) {
    res.status(400).json({ message: "missing body." });
  } else {
    const addWord = require("../../route-handlers/add-new-word");
    const result = await addWord(uuid, category, word);
    res.status(200).json({ message: result });
  }
  // res.status(501).json({ message: "api/v1/ not implemented." });
});

module.exports = router;
