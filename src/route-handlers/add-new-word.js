const LingoWord = require('../models/lingowordModel');
const checkString = require('../utils/validate-inputs');

async function addWord(ownerId, categoryId, lingoWord) {
  const owner = checkString(ownerId);
  const category = checkString(categoryId);
  const word = checkString(word);

  if (!owner || !category || !lingoWord) {
    return;
  }

  try {
    const findResult = await LingoWord.find({
      word: word,
      category: category,
      owner: owner,
      deleted: false
    }).exec();

    let addedItem;

    if (!findResult[0]) {
      const addedItem = await LingoWord.create({
        word: word,
        category: category,
        owner: owner
      });
      return addedItem.word;
    } else {
      return findResult[0].word;
    }
  } catch (error) {
    return error;
  }
}

module.exports = addWord;
