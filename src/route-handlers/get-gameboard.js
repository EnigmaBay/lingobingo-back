const cache = require("../utils/cache");
const timeStamper = require("../utils/time-stamper");

async function getGameboard(req, res, next) {
  const { checkString } = require("../utils/validate-inputs");
  const uuid = checkString(req.params.id);

  console.log("get-gameboard fetching gameboard", uuid);
  const maxCacheLifetime = process.env.MAX_CACHE_LIFETIME;
  const key = uuid + "-method-" + req.method + "-path-" + req.path;

  if (cache[key] && Date.now() - cache[key].timestamp < maxCacheLifetime) {
    console.log("get-gameboard cache HIT");
    if (Array.isArray(cache[key].data) && cache[key].data.length > 1) {
      res.locals.statusCode = 200;
    } else {
      res.locals.statusCode = 404;
    }
  } else {
    const GameBoard = require("../models/bingoboardModel");
    console.log("get-gameboard cache MISS");
    const getWords = require("../route-handlers/get-words");
    cache[key] = {};
    cache[key].timestamp = timeStamper();
    cache[key].data = await GameBoard.findOne({
      uuid: uuid,
      isDeleted: false,
    })
      .exec()
      .then((gameboard) => {
        const words = getWords(gameboard.owner, gameboard.category);
        res.locals.statusCode = 200;
        return words;
      })
      .catch((error) => {
        console.log("get-gameboard returning error:", error);
        res.locals.statusCode = 404;
        return { message: "Ask your presenter for a new URL." };
      });
  }

  res.locals.resultMsg = cache[key].data;
  next();
}

module.exports = getGameboard;
