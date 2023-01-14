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
  const category = req.params.category;
  const getWords = require("../../route-handlers/get-words");

  if (!category) {
    res.status(400).json({ message: "missing category in params." });
  } else {
    // todo: when cache enabled also send req.path to getWords func
    getWords(req.cookies["useruuid"], category)
      .then((wordList) => {
        res.status(200).send({ wordList });
      })
      .catch((error) => {
        // todo: fix this catch to not leak code details
        console.log(
          "get words/:category unable to query using supplied category",
          category,
          error
        );
        res.status(500).json({ message: "Unable to query category." });
      });
  }
});

router.post("/word", cookieValidator, async (req, res, next) => {
  const { category, word } = req.body;

  if (!category || !word) {
    res.status(400).json({ message: "missing body." });
  } else {
    const addWord = require("../../route-handlers/add-new-word");
    const result = await addWord(req.cookies["useruuid"], category, word);
    res.status(200).json({ message: result });
  }
});

module.exports = router;
