async function getGameboard(req, res, next) {
  const { checkString } = require("../utils/validate-inputs");
  const uuid = checkString(req.params.id);

  console.log(
    "get-gameboard cleansed inputs, searching for gameboard uuid",
    uuid
  );

  const GameBoard = require("../models/bingoboardModel");
  const foundGameboard = await GameBoard.findOne({
    uuid: uuid,
    isDeleted: false,
  }).exec();

  if (foundGameboard) {
    const getWords = require("../route-handlers/get-words");
    const { owner, category } = foundGameboard;
    // console.log(
    //   "get-gameboard recovered gameboard owner and category:",
    //   owner,
    //   category
    // );
    const wordList = await getWords(owner, category);
    // console.log("get-gameboard wordList from get-words is", wordList);
    res.locals.statusCode = 200;
    res.locals.resultMsg = wordList;
  } else {
    console.log("get-gameboard returning not found!");
    res.locals.statusCode = 404;
    res.locals.resultMsg = { message: "Ask your presenter for a new URL." };
  }

  next();
}

module.exports = getGameboard;
