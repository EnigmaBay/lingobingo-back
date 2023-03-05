const { checkString } = require("../utils/validate-inputs");
const generateUuid = require("../utils/gameboard-uuid-generator");
const getWords = require("./get-words");

async function createGameboard(req, res, next) {
  // validate inputs
  const ownerUuid = req.cookies["useruuid"];
  const category = req.body.category;

  // generate a gameboardUuid
  const presenterUuid = checkString(ownerUuid);
  const cat = checkString(category);
  let gameboardUuid;

  // if not enough words doesn't matter if gameboard exists stop
  const words = await getWords(ownerUuid, category);

  try {
    if (words.length < 24) {
      // because we are in middleware and 24 words or more is absolute
      // requirement throw an appropriate error message here.
      throw new Error("create-gameboard: Not enough words in category.");
    }

    // find existing
    const GameBoard = require("../models/bingoboardModel");
    const foundGameboard = await GameBoard.findOne({
      owner: ownerUuid,
      category: category,
    }).exec();

    if (!foundGameboard) {
      const concatString = `${presenterUuid}${cat}`;
      gameboardUuid = generateUuid(concatString);

      // create a gameboard
      await GameBoard.create({
        uuid: gameboardUuid,
        owner: ownerUuid,
        category: category,
      });
    } else {
      // A gameboard already exists
      // timestamp and force isDeleted flag to false
      const timeStamper = require('../utils/time-stamper');
      const timeStamp = timeStamper();
      foundGameboard["isDeleted"] = false;
      foundGameboard["updated"] = timeStamp;
      await foundGameboard.save();
      gameboardUuid = foundGameboard["uuid"];
    }
  } catch (error) {
    // catch error message and set status and message then let
    // error handler do the rest.
    console.log("create-gameboard threw error:", error.message);
    res.locals.statusCode = 400;
    res.locals.resultMsg = error.message;
    next(error);
  }

  // return gameboard UUID
  res.locals.gameboardUuid = gameboardUuid;
  next();
}

module.exports = createGameboard;
