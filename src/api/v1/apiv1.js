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
        console.log("get authorize store.then validUuid", validUuid);
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
  console.log('category is:', category);
  // done: when cookies implemented replace this with cookie validator
  // const uuid = process.env.TEST_UUID;
  const getWords = require("../../route-handlers/get-words");

  if (!category) {
    console.log("category missing or undefined", category);
    res.status(400).json({ message: "missing category in params." });
  } else {
    console.log('calling getWords with userUuid, category', req.cookies['useruuid'], category);
    // todo: when cache enabled also send req.path to getWords func
    getWords(req.cookies["useruuid"], category)
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

router.post("/word", cookieValidator, async (req, res) => {
  const { category, word } = req.body;
  // const uuid = process.env.TEST_UUID;

  if (!category || !word) {
    res.status(400).json({ message: "missing body." });
  } else {
    const addWord = require("../../route-handlers/add-new-word");
    const result = await addWord(req.cookies["useruuid"], category, word);
    res.status(200).json({ message: result });
  }
  // res.status(501).json({ message: "api/v1/ not implemented." });
});

module.exports = router;
