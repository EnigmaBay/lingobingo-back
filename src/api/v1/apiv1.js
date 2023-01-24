const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authorize = require("../../authorization/authorize");
const { generateUuid, store } = require("../../utils/presenter-utils");
const cookieSetter = require("../../authorization/cookie-setter");
const cookieValidator = require("../../authorization/cookie-validator");

mongoose.connect(process.env.MONGO_CONN_STRING);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongoose is connected.");
});

router.get("/", (req, res) => {
  res.status(501).json({ message: "api/v1/ not implemented." });
});

router.get("/authorize", authorize, async (req, res, next) => {
  if (!req.user) {
    res.status(400).json({ message: "Authorization failed." });
  } else {
    const presenterUuid = await generateUuid(
      req.user.given_name,
      req.user.email,
      req.user.locale
    );

    store(presenterUuid)
      .then((validUuid) => {
        res.locals.presenterUuid = validUuid;
        cookieSetter(req, res, next);

        if (res.locals.cookieResult) {
          res.json({ message: "Authorization granted." });
        } else {
          res.json({ message: "Unauthorized." });
        }
      })
      .catch((error) =>
        res.status(500).json({ mesesage: "Unable to store presenter uuid." })
      );
  }
});

router.get("/words/:category", cookieValidator, async (req, res, next) => {
  console.log("GET words/:category params.id", req.params.category);
  const category = req.params.category;

  if (res.locals.cookieResult === "Authorized" && category.length > 0) {
    const getWords = require("../../route-handlers/get-words");
    const cat = category.trim();
    console.log("calling getWords.");
    const wordList = await getWords(req.cookies["useruuid"], cat);
    console.log("route /words/:category will return wordList", wordList);
    res.status(200).json(wordList);
  } else {
    const msg = res.locals.cookieResult;
    res.status(403).json({ message: msg });
  }
});

router.post("/word", cookieValidator, async (req, res, next) => {
  const { category, word } = req.body;
  console.log('POST word body', category, word);

  if (!category || !word) {
    res.status(400).json({ message: "missing body." });
  } else {
    const addWord = require("../../route-handlers/add-new-word");
    const result = await addWord(req.cookies["useruuid"], category, word);
    res.status(200).json({ message: result });
  }
});

module.exports = router;
