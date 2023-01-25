const LingoWord = require('../models/lingowordModel');
const checkString = require('../utils/validate-inputs');
const timeStamper = require('../utils/time-stamper');

async function updateWord(req, res, category, oldWord, replacementWord) {
  const owner = checkString(req.cookies["useruuid"]);
  const cat = checkString(category);
  const word = checkString(oldWord);
  const newWord = checkString(replacementWord);

  if (!owner || !cat || !word || !newWord) {
    return;
  }

  try {
    const findResult = await LingoWord.find({
      word: word,
      category: cat,
      owner: owner,
      deleted: false,
    }).exec();

    console.log('update-word findResult is', findResult);

    if (!findResult) {
      res.locals.statusCode = 404;
      res.locals.resultMsg = 'Not found';
      return;
    } else {
      const result = findResult[0];
      const timeStamp = timeStamper();
      result['word'] = newWord;
      result['updated'] = timeStamp;
      await result.save();
      return newWord;
    }
  } catch (error) {
    return error.message;
  }
}

module.exports = updateWord;
