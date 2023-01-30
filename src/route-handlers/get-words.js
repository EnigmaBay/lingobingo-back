const LingoWord = require("../models/lingowordModel");
const { checkString } = require("../utils/validate-inputs");

function getWords(uuid, lingoCategory) {
  console.log(
    "entered getWords with args uuid, lingoCategory",
    uuid,
    lingoCategory
  );

  const owner = checkString(uuid);
  const category = checkString(lingoCategory);

  const findResult = LingoWord.find({
    category: category,
    owner: owner,
    deleted: false,
  })
    .exec()
    .then((response) => parseResponse(response));

  return findResult;
}

function parseResponse(dbResponse) {
  const wordList = [];

  try {
    dbResponse.forEach((item) => {
      wordList.push(item["word"]);
    });

    return Promise.resolve(wordList);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = getWords;
