const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authorize = require("../../authorization/authorize");
const cookieSetter = require("../../authorization/cookie-setter");
const cookieValidator = require("../../authorization/cookie-validator");
const getGameboard = require("../../route-handlers/get-gameboard");
const createGameboard = require("../../route-handlers/create-gameboard");
const setGameboard = require("../../route-handlers/set-gameboard.js");
const deleteGameboard = require("../../route-handlers/delete-gameboard");

// maintain strictQuery behavior in Mongoose 7 (https://mongoosejs.com/docs/guide.html#strictQuery)
mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGO_CONN_STRING);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongoose is connected.");
});

router.get("/authorize", authorize, cookieSetter, async (req, res, next) => {
  const statusCode = res.locals.statusCode;
  const resultMsg = res.locals.resultMsg;
  res.status(statusCode).json({ message: resultMsg });
});

router.get("/words/:category", cookieValidator, async (req, res, next) => {
  console.log("GET words/:category params.id", req.params.category);
  const category = req.params.category;

  if (category.length === 0) {
    res.status(400).json({ message: "Missing category" });
  } else {
    const getWords = require("../../route-handlers/get-words");
    const cat = category.trim();
    const wordList = await getWords(req.cookies["useruuid"], cat);
    res.status(200).json({ "words": wordList});
  }
});

router.post("/word", cookieValidator, async (req, res, next) => {
  const { category, word } = req.body;
  console.log("POST word body", category, word);

  if (!category || !word) {
    res.status(400).json({ message: "Missing body" });
  }
  res.locals.word = word;
  res.locals.category = category;
  res.locals.newWord = word;
  const addWord = require("../../route-handlers/updadd-word");
  await addWord(req, res, next);
  res
    .status(res.locals.statusCode)
    .json({ "New word": `${res.locals.newWord}` });
});

router.get("/categories", cookieValidator, async (req, res, next) => {
  const getCategories = require("../../route-handlers/get-categories");
  const result = await getCategories(req, res, next);
  console.log('categories: getCategories returned result, result.length',result, result.length);
  const resultMsg = result;
  const statusCode = result.length > 0 && 200 || 404;
  res.status(statusCode).json(resultMsg);
});

router.patch("/word", cookieValidator, async (req, res, next) => {
  console.log("PATCH Word for user", req.cookies["useruuid"]);
  const { category, word, newWord } = req.body;

  if (!category || !word || !newWord) {
    res.status(400).json({ message: "Missing body" });
  } else {
    res.locals.word = word;
    res.locals.category = category;
    res.locals.newWord = newWord;
    const addWord = require("../../route-handlers/updadd-word");
    await addWord(req, res, next);
    res
      .status(res.locals.statusCode)
      .json({ "New word": `${res.locals.newWord}` });
  }
});

router.delete("/word", cookieValidator, async (req, res, next) => {
  const { category, word } = req.body;

  if (!category || !word) {
    res.status(400).json({ message: "Missing body" });
  } else {
    res.locals.category = category;
    res.locals.word = word;
    const removeWord = require("../../route-handlers/remove-word");
    removeWord(req, res, next)
      .then(() =>
        res
          .status(res.locals.statusCode)
          .json({ message: `${res.locals.resultMsg}` })
      )
      .catch(() => console.log("delete word route catch error ==>"));
  }
});

router.get("/gameboard/:id", getGameboard, async (req, res, next) => {
  const statusCode = res.locals.statusCode;
  const resultMsg = res.locals.resultMsg;
  res.status(statusCode).json(resultMsg);
});

router.post(
  "/gameboard",
  cookieValidator,
  createGameboard,
  setGameboard,
  async (req, res, next) => {
    const statusCode = res.locals.statusCode;
    const resultMsg = res.locals.resultMsg;
    res.status(statusCode).json({ message: resultMsg });
  }
);

router.delete(
  "/gameboard",
  cookieValidator,
  deleteGameboard,
  async (req, res, next) => {
    const statusCode = res.locals.statusCode;
    const resultMsg = res.locals.resultMsg;
    res.status(statusCode).json({ message: resultMsg });
  }
);

module.exports = router;
