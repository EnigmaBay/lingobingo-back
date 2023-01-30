const { checkString } = require("../utils/validate-inputs");
const generateUuid = require("../utils/gameboard-uuid-generator");

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
      gameboardUuid = foundGameboard["uuid"];
    }
  } catch (error) {
    console.log("create-gameboard threw error:", error.message);
    res.locals.statusCode = 500;
    res.locals.resultMsg = "Unable to complete request.";
  }

  // return gameboard UUID
  res.locals.gameboardUuid = gameboardUuid;
  console.log(
    "create-gameboard: gameboardUuid is",
    res.locals.gameboardUuid
  );
  next();
}

module.exports = createGameboard;
