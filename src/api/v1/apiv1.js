const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authorize = require("authorization/authorize");
const cookieSetter = require("authorization/cookie-setter");
const cookieValidator = require("authorization/cookie-validator");
const getGameboard = require("src/route-handlers/get-gameboard.js");

mongoose.connect(process.env.MONGO_CONN_STRING);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongoose is connected.");
});

router.get("/authorize", authorize, cookieSetter);

router.get("/words/:category", cookieValidator, async (req, res, next) => {
  console.log("GET words/:category params.id", req.params.category);
  const category = req.params.category;

  if (res.locals.cookieResult !== "Authorized") {
    res.status(401).json({ message: "Unauthorized" });
  }

  if (category.length === 0) {
    const msg = res.locals.cookieResult;
    res.status(400).json({ message: "Missing category" });
  }

  if (res.locals.cookieResult === "Authorized" && category.length >= 1) {
    const getWords = require("../../route-handlers/get-words");
    const cat = category.trim();
    console.log("calling getWords.");
    const wordList = await getWords(req.cookies["useruuid"], cat);
    console.log("route /words/:category will return wordList", wordList);
    res.status(200).json(wordList);
  }
});

router.post("/word", cookieValidator, async (req, res, next) => {
  const { category, word } = req.body;
  console.log("POST word body", category, word);

  if (res.locals.cookieResult !== "Authorized") {
    res.status(401).json({ message: "Unauthorized" });
  }

  if (!category || !word) {
    res.status(400).json({ message: "Missing body" });
  }

  if (res.locals.cookieResult === "Authorized" && category && word) {
    const addWord = require("../../route-handlers/add-new-word");
    const result = await addWord(req.cookies["useruuid"], category, word);
    res.status(200).json({ message: result });
  }
});

router.get("/categories", cookieValidator, async (req, res, next) => {
  console.log("GET Categories for user", req.cookies["useruuid"]);

  if (res.locals.cookieResult === "Authorized") {
    const getCategories = require("../../route-handlers/get-categories");
    const result = await getCategories(req.cookies["useruuid"]);
    res.status(200).json(result);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.patch("/word", cookieValidator, async (req, res, next) => {
  console.log("PATCH Word for user", req.cookies["useruuid"]);

  if (res.locals.cookieResult !== "Authorized") {
    res.status(401).json({ message: "Unauthorized" });
  }

  const { category, word, newWord } = req.body;
  console.log("PATCH Word category, word, newWord", category, word, newWord);

  if (!category || !word || !newWord) {
    res.status(400).json({ message: "Missing body" });
  }

  if (res.locals.cookieResult === "Authorized") {
    const updateWord = require("../../route-handlers/update-word");
    const result = await updateWord(req, res, category, word, newWord);
    if (res.locals.statusCode && res.locals.resultMsg) {
      const statusCode = res.locals.statusCode;
      const resultMsg = res.locals.resultMsg;
      res.status(statusCode).json(resultMsg);
    } else {
      res.status(200).json(result);
    }
  } else {
    console.log("An error occurred in PATCH /word");
    res.status(500);
  }
});

router.delete("/word", cookieValidator, async (req, res, next) => {
  console.log("DELETE Word for user", req.cookies["useruuid"]);

  if (res.locals.cookieResult !== "Authorized") {
    res.status(401).json({ message: "Unauthorized" });
  }

  const { category, word } = req.body;
  console.log("DELETE Word category, word", category, word);

  if (!category || !word) {
    res.status(400).json({ message: "Missing body" });
  }

  if (res.locals.cookieResult === "Authorized") {
    const removeWord = require("../../route-handlers/remove-word");
    const result = await removeWord(req, res, category, word);

    if (res.locals.statusCode && res.locals.resultMsg) {
      const statusCode = res.locals.statusCode;
      const resultMsg = res.locals.resultMsg;
      res.status(statusCode).json(resultMsg);
    } else {
      res.status(200).json(result);
    }
  } else {
    console.log("An error occurred in DELETE /word");
    res.status(500);
  }
});

router.get("/gameboard/:id", getGameboard);

router.post("/gameboard", cookieValidator, async (req, res, next) => {
    const createGameboard = require("src/route-handlers/create-gameboard.js");
    createGameboard(req, res, next);
    const setGameboard = require("src/route-handlers/set-gameboard.js");
    setGameboard(req, res, next);
});

module.exports = router;
