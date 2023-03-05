// function will update an existing word
// or add new if it does not already exist
// and will reset deleted field appropriately

const LingoWord = require("../models/lingowordModel");
const { checkString } = require("../utils/validate-inputs");
const timeStamper = require("../utils/time-stamper");

async function updaddWord(req, res, next) {
  const owner = checkString(req.cookies["useruuid"]);
  const category = checkString(res.locals.category);
  const word = checkString(res.locals.word);
  const newWord = checkString(res.locals.newWord);
  const timeStamp = timeStamper();

  try {
    const findWord = await LingoWord.findOne({
      word: word,
      category: category,
      owner: owner,
    }).exec();
    console.log("updadd-word findWord:", findWord);

    if (word === newWord) {
      // create new word or swap 'deleted' flag to true
      if (findWord) {
        if (findWord["deleted"] === true) {
          // just flip the flag to false
          findWord["deleted"] = false;
          findWord["updated"] = timeStamp;
          findWord.save();
          // DONE
          console.log("updadd-word flipped deleted flag to false, word:", word);
          res.locals.statusCode = 201;
          res.locals.resultMsg = word;
        } else {
          // no work to do word exists return http 200
          console.log(
            "updadd-word: word equals new word, word was found, and deleted flag is false."
          );
          res.locals.statusCode = 200;
          res.locals.resultMsg = word;
        }
      } else {
        const addedItem = await LingoWord.create({
          word: word,
          category: category,
          owner: owner,
        });
        console.log("updadd-word addedItem:", addedItem);
        res.locals.statusCode = 201;
        res.locals.newWord = word;
      }
    } else {
      // word NOT equal newWord so must be an update
      const findNewWord = await LingoWord.findOne({
        word: newWord,
        category: category,
        owner: owner,
      });
      console.log("updadd-word findNewWord:", findNewWord);

      if (findWord) {
        // word exists
        if (findNewWord) {
          // newWord ALSO exists so update them BOTH
          findWord["deleted"] = true;
          findWord["updated"] = timeStamp;
          await findWord.save();
          findNewWord["deleted"] = false;
          findNewWord["updated"] = timeStamp;
          await findNewWord.save();
          console.log(
            "updadd-word found word and new word so flipped deleted flags accordingly."
          );
          res.locals.statusCode = 201;
          res.locals.newWord = newWord;
        } else {
          // newWord does NOT exist to just update word
          findWord["word"] = newWord;
          findWord["deleted"] = false;
          findWord["updated"] = timeStamp;
          await findWord.save();
          console.log(
            "updadd-word found word but not new word so just updated word to:",
            findWord
          );
          res.locals.statusCode = 201;
          res.locals.newWord = newWord;
        }
      } else {
        // word NOT found
        if (findNewWord) {
          // but newWord exists just mark deleted false and return
          findNewWord["deleted"] = false;
          findNewWord["updated"] = timeStamp;
          console.log(
            "updadd-word found ONLY new word, set deleted flag false."
          );
          res.locals.statusCode = 201;
          res.locals.newWord = newWord;
        } else {
          // newWord does NOT exist either so just create it
          const addedItem = await LingoWord.create({
            word: newWord,
            category: category,
            owner: owner,
          });
          console.log(
            "updadd-word found NEITHER word nor new word, addedItem is:",
            addedItem
          );
          res.locals.statusCode = 201;
          res.locals.newWord = newWord;
        }
      }
    }
  } catch (error) {
    console.log("updadd-word caught an error:", error);
    next(error);
  }
}

module.exports = updaddWord;
