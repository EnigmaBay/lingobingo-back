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
  const cache = require("../utils/cache");
  const maxCacheLifetime = process.env.MAX_CACHE_LIFETIME;
  const key = uuid + "-category-" + lingoCategory;

  if (cache[key] && Date.now() - cache[key].timestamp < maxCacheLifetime) {
    console.log("get-words cache HIT");
  } else {
    console.log("get-words cache MISS");
    const timeStamper = require("../utils/time-stamper");
    cache[key] = {};
    cache[key].timestamp = timeStamper();
    cache[key].data = LingoWord.find({
      category: category,
      owner: owner,
      deleted: false,
    })
      .exec()
      .then((response) => {
        const wordList = [];
        response.forEach((item) => {
          wordList.push(item["word"]);
        });
        return wordList;
      })
      .catch((error) => {
        console.log("error in get-words", error.message);
        return [];
      });
  }
  return cache[key].data;
}

module.exports = getWords;
