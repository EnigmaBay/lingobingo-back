const LingoWord = require("../models/lingowordModel");
const checkString = require("../utils/validate-inputs");

async function getWords(uuid, lingoCategory) {
  const owner = checkString(uuid);
  const category = checkString(lingoCategory);
  
  const findResult = LingoWord.find({
    category: category,
    owner: uuid,
    deleted: false,
  }).exec();

  const wordList = [];

  try {
    findResult.forEach((element) => {
      wordList.push(element["word"]);
    });

    return wordList;
  } catch (error) {
    return error.message;
  }
}

module.exports = getWords;
