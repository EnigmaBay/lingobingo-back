// gather owner and category, generate a uuid and store it to the database
// inputs: ownerUuid, Category
// returns: gameboardUuid or -1

async function createGameboard(req, res, next) {
  // validate inputs
  const ownerUuid = req.cookies["useruuid"];
  const category = req.body.category;
  console.log(
    "create-gameboard helper received ownerUuid, category",
    ownerUuid,
    category
  );

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

    if (!foundGameboard) {
      const generateUuid = require("src/utils/gameboard-uuid-generator.js");
      const concatString = `${presenterUuid}${cat}`;
      gameboardUuid = generateUuid(concatString);
      // create a gameboard
      await GameBoard.create({
        uuid: gameboardUuid,
        owner: ownerUuid,
        category: category,
      });
    } else {
      gameboardUuid = foundGameboard.uuid;
    }
  } catch (error) {
    console.log("create-gameboard threw error:", error.message);
    res.status(500).json({ message: "Unable to complete request." });
  }

  // return gameboard UUID
  res.locals.gameboardUuid = foundGameboard.uuid;
  next();
}

module.exports = createGameboard;
