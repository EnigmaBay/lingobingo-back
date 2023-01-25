const LingoWord = require("../models/lingowordModel");
const checkString = require("../utils/validate-inputs");
const timeStamper = require("../utils/time-stamper");

async function updateWord(req, res, category, oldWord, replacementWord) {
  const owner = checkString(req.cookies["useruuid"]);
  const cat = checkString(category);
  const word = checkString(oldWord);
  const newWord = checkString(replacementWord);

  if (!owner || !cat || !word || !newWord) {
    return;
  }

  try {
    const findResult = await LingoWord.findOne({
      word: word,
      category: cat,
      owner: owner,
      deleted: false,
    }).exec();

    console.log("update-word findResult is", findResult);

    if (findResult && category === findResult.category) {
      console.log("update-word findResult exists and category matches");
      const timeStamp = timeStamper();
      findResult["word"] = newWord;
      findResult["updated"] = timeStamp;
      await findResult.save();
      return newWord;
    } else {
      console.log(
        "update-word findResult empty or category not equal to input category:",
        category,
        "word, new word:",
        word,
        newWord
      );
      res.locals.statusCode = 404;
      res.locals.resultMsg = "Not found";
      return;
    }
  } catch (error) {
    return error.message;
  }
}

module.exports = updateWord;
