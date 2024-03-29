const { checkString } = require("../utils/validate-inputs");

// attaches a gameboard ID to a presenter and returns the gameboard URI
async function setGameboard(req, res, next) {
  const presenterUuid = checkString(req.cookies["useruuid"]);
  const gameboardUuid = checkString(res.locals.gameboardUuid);

  try {
    const Presenter = require("../models/presenterModel");
    const existingPresenter = await Presenter.findOne({
      uuid: presenterUuid,
      deleted: false,
    }).exec();

    if (!existingPresenter) {
      res.locals.statusCode = 500;
      res.locals.resultMsg = "Unable to validate Presenter.";
      return;
    } else {
      console.log("set-gameboard found existingPresenter:", existingPresenter["uuid"]);
    }

    const BingoBoard = require("../models/bingoboardModel");
    const existingGameboard = await BingoBoard.findOne({
      owner: presenterUuid,
      uuid: gameboardUuid,
      deleted: false,
    }).exec();

    if (!existingGameboard) {
      res.locals.statusCode = 500;
      res.locals.resultMsg = "Unable to retreive expected Bingoboard.";
      return;
    } else {
      console.log("set-gameboard found existingGameboard:", existingGameboard["uuid"]);
    }

    const gameboardId = existingGameboard.uuid;
    const gameboardSet = new Set();

    existingPresenter.bingoboards.forEach((item) => {
      gameboardSet.add(item);
    });

    gameboardSet.add(gameboardId);
    const uniqueBingoboards = Array.from(gameboardSet);
    existingPresenter.bingoboards = uniqueBingoboards;

    const timeStamper = require("../utils/time-stamper");
    const timeStamp = timeStamper();
    existingPresenter.updated = timeStamp;
    const updatedPresenter = await existingPresenter.save();

    const hostname = req.hostname;
    const port = process.env.PORT;
    const getGameboardUri = `https://${hostname}:${port}/api/v1/gameboard/${gameboardId}`;

    res.locals.statusCode = 201;
    res.locals.resultMsg = getGameboardUri;
    next();
  } catch (error) {
    console.error(
      "setting gameboard to presenter profile failed.",
      error.message
    );
    res.locals.statusCode = 500;
    res.locals.resultMsg = "setting gameboard to presenter profile failed.";
    next(error);
  }
  // return;
}

module.exports = setGameboard;
