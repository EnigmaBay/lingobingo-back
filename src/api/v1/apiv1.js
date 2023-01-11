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

router.post("/data", async (req, res) => {
  const { category, word } = req.body;
  const uuid = process.env.TEST_UUID;

  if (!category || !word || !uuid) {
    res.status(400).json({ message: "missing body." });
  } else {
    const addWord = require("../../route-handlers/add-new-word");
    const result = await addWord(uuid, category, word);
    res.status(200).json({ message: result });
  }
});

module.exports = router;
