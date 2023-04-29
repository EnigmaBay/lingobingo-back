const LingoWord = require("../models/lingowordModel");
const checkString = require("../utils/validate-inputs");

async function getCategories(useruuid) {
  const uuid = checkString(useruuid);

  if (!uuid) {
    return;
  } else {
    try {
      const findResult = await LingoWord.find({
        owner: uuid,
        deleted: false,
      }).exec();

      const result = await parseResponse(findResult);
      return result;
    } catch (error) {
      console.log("error in getCategories", error.message);
      return [];
    }
  }
}

async function parseResponse(dbResponse) {
  const mySet = new Set();

  try {
    dbResponse.forEach((item) => {
      mySet.add(item["category"]);
    });

    const result = Array.from(mySet);
    return result;
  } catch (error) {
    console.log("error in getCategories parseResponse", error.message);
    return [];
  }
}

module.exports = getCategories;
