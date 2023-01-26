
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

  console.log("get-gameboard foundGameboard is", foundGameboard);

  if (
    foundGameboard &&
    foundGameboard.uuid === uuid &&
    !foundGameboard.isDeleted
  ) {
    const getWords = require("./get-words");
    const { owner, category } = foundGameboard;
    const wordList = getWords(owner, category);
    res.status(200).json(wordList);
  }

  console.log("get-gameboard returning -1 (not found).");
  return -1;
}

module.exports = getGameboard;
