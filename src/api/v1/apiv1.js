const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

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

router.get("/words/:category", async (req, res) => {
  console.log("received GET /words/:category", req.params);
  const category  = req.params.category;
  console.log("category is", category);
  const uuid = process.env.TEST_UUID;
  console.log("uuid is", uuid);
  const getWords = require("../../route-handlers/get-words");
  if (!uuid || !category) {
    console.log("uuid and category were undefined", uuid, category);
    res.status(400).json({ message: "missing category in params." });
  } else {
    const result = getWords(uuid, category);
    console.log("awaited getWords() returned", result);
    res.status(200).json({ message: result });
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
