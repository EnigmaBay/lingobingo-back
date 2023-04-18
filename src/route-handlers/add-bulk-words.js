const LingoWord = require('../models/lingowordModel');
const timeStamper = require('../utils/time-stamper');
const { checkString } = require('../utils/validate-inputs');

async function addBulkWords(req, res, next) {
  const owner = checkString(res.locals.presenterUuid);
  const { category, words } = req.body;

  if (typeof category !== 'string' || category.length < 2) {
    res.locals.statusCode = 400;
    next('Category is empty or invalid');
  } else {
    const bulkWordArr = words.split(',');

    if (!Array.isArray(bulkWordArr)) {
      res.locals.statusCode = 400;
      next('Words not comma separated');
    } else {
      console.log(
        'addBulkWords bulkWordArr, size:',
        bulkWordArr,
        bulkWordArr.length
      );
      if (bulkWordArr.length < 4) {
        res.locals.statusCode = 400;
        next('Not enough words (need at least 24)');
      } else {
        const setInput = [];
        bulkWordArr.forEach((word) => {
          setInput.push(word.trim());
        });
        const inputSet = new Set(setInput);
        const resultArray = [];
        const existingLingoWordsInDB = await LingoWord.find({
          owner: owner,
          category: category,
        }).exec();

        console.log(
          'addBulkWords exist in DB count:',
          existingLingoWordsInDB.length
        );

        existingLingoWordsInDB.forEach((entity) => {
          if (inputSet.has(entity['word'])) {
            inputSet.delete(entity['word']);
            entity.deleted = false;
            entity.updated = timeStamper();
            entity
              .save()
              .then((result) =>
                console.log(
                  'saved entity after changing deleted state to false:',
                  result
                )
              )
              .catch((err) =>
                console.log(
                  'caught error changing deleted state to false and saving:',
                  err.message
                )
              );
          } else {
            // inputSet does NOT contain the current DB word so skip it
          }
        });

        inputSet.forEach((inputWord) => {
          const newWord = inputWord.trim();
          console.log(
            'addBulkWords inputWord, trimmed inputWord:',
            inputWord,
            newWord
          );
          if (newWord.length > 0) {
            const newEntity = new LingoWord({
              owner: owner,
              category: category,
              word: inputWord,
              deleted: false,
            });
            resultArray.push(newEntity);
          } else {
            // skip words that are empty strings
            console.log(
              'addBulkWords: An empty or blankspace String was detected in user input, owner:',
              owner
            );
          }
        });

        console.log(
          'addBulkWords: Total NEW words to add to DB:',
          resultArray.length
        );
        // do one bulk async save and return as a Promise for handling
        return LingoWord.insertMany(resultArray);
      }
    }
  }
}

module.exports = addBulkWords;
