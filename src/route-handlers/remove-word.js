const LingoWord = require("../models/lingowordModel");
const { checkString } = require("../utils/validate-inputs");
const timeStamper = require("../utils/time-stamper");

async function deleteWord(req, res, next) {
  const owner = checkString(req.cookies["useruuid"]);
  const cat = checkString(res.locals.category);
  const word = checkString(res.locals.word);

  if (!owner || !cat || !word) {
    res.locals.statusCode = 400;
    next("Invalid request");
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
    let resultMsg;

    if (updatedItem["modifiedCount"] === 1) {
      resultMsg = "deleted.";
      res.locals.statusCode = 200;
      console.log('remove-word: status code: 200');
    } else {

    if (updatedItem["modifiedCount"] > 1) {
      resultMsg = "multiple deleted.";
      res.locals.statusCode = 500;
      console.log('remove-word: status code: 500');
    } else {
      // updatedItem["modifiedCount"] < 1
      resultMsg = "not found.";
      res.locals.statusCode = 404;
      console.log('remove-word: status code: 404');
    }

    console.log('remove-word calling next with resultMsg:', resultMsg);
    next(resultMsg);
  }

    res.locals.resultMsg = resultMsg;
  } catch (error) {
    console.log('error.message:', error.message);
    res.locals.statusCode = 500;
    next(error.message);
  }
}

module.exports = deleteWord;
