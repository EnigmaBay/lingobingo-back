const LingoWord = require("../models/lingowordModel");
const { checkString } = require("../utils/validate-inputs");
const timeStamper = require("../utils/time-stamper");

async function deleteWord(req, res, category, wordToDelete) {
  const owner = checkString(req.cookies["useruuid"]);
  const cat = checkString(category);
  const word = checkString(wordToDelete);

  if (!owner || !cat || !word) {
    res.locals.statusCode = 400;
    res.locals.resultMsg = "Invalid request";
    return word;
  }

  try {
    const timeStamp = timeStamper();

    const updatedItem = await LingoWord.updateOne(
      {
        word: word,
        category: cat,
        owner: owner,
        deleted: false,
      },
      {
        deleted: true,
        updated: timeStamp,
      }
    );

    console.log("remove-word update db statistics:", updatedItem);

    if (updatedItem["modifiedCount"] === 1) {
      resultMsg = "deleted.";
      statusCode = 200;
    }

    if (updatedItem["modifiedCount"] > 1) {
      resultMsg = "multiple deleted.";
      statusCode = 500;
    }

    if (updatedItem["modifiedCount"] < 1) {
      resultMsg = "not found.";
      statusCode = 404;
    }

    res.locals.resultMsg = resultMsg;
    res.locals.statusCode = statusCode;
  } catch (error) {
    console.log(error.message);
    res.locals.statusCode = 500;
    res.locals.resultMsg = "Error";
  }

  return word;
}

module.exports = deleteWord;
