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

  try {
    // find existing
    const GameBoard = require("../models/bingoboardModel");
    const foundGameboard = await GameBoard.findOne({
      owner: ownerUuid,
      category: category,
    }).exec();

    console.log(
      "foundGameboard object returned from GameBoard.findOne()",
      foundGameboard
    );

    let words;

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
      words = await getWords(ownerUuid, category);
      if (words.count > 23) {
        gameboardUuid = foundGameboard["uuid"];
      } else {
        console.log(
          "create-gameboard: not enough words in category!",
          words.count
        );
        throw new Error("Not eough words in category.");
      }
    }
  } catch (error) {
    console.log("create-gameboard threw error:", error.message);
    res.locals.statusCode = 400;
    res.locals.resultMsg =
      "Need at least 24 words in a category to create a board.";
  }

  // return gameboard UUID
  res.locals.gameboardUuid = gameboardUuid;
  console.log("create-gameboard: gameboardUuid is", res.locals.gameboardUuid);
  next();
}

module.exports = createGameboard;
