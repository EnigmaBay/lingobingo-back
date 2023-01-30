// adds a new gameboard to the database

// gather ownerUuid and category
async function addGameboard(ownerUuid, category) {
  // validate inputs?
  console.log(
    "addGameboard helper received ownerUuid, category",
    ownerUuid,
    category
  );

// generate a gameboardUuid
const presenterUuid = checkString(ownerUuid);
  const cat = checkString(category);

  // generate uuid
  const concatStrings = `${presenterUuid}${cat}`;
  const gameboardUuid = generateUuid(concatStrings);

  // find existing
  const GameBoard = require("../models/bingoboardModel");
  const foundGameboard = await GameBoard.findOne({
    uuid: gameboardUuid,
    owner: ownerUuid,
    category: category,
  }).exec();

  if (
    foundGameboard &&
    foundGameboard.owner === ownerUuid &&
    foundGameboard.category === category
  ) {
    // return gameboard UUID
    return foundGameboard.uuid;
  }

  // unable to create
  return -1;
}

module.exports = addGameboard;
