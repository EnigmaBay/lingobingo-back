const { checkString } = require("../utils/validate-inputs");

// attaches a gameboard ID to a presenter and returns the gameboard URI
async function setGameboard(req, res, next) {
  if (res.locals.cookieResult !== "Authorized") {
    res.status(400).json({ message: "Unauthorized." });
  }

  const presenterUuid = checkString(req.cookies['useruuid']);
  const gameboardUuid = checkString(res.locals.gameboardUuid);
  console.log(
    "setGameboard received presenterUuid, gameboardUuid",
    presenterUuid,
    gameboardUuid
  );

  try {
    const Presenter = require("../models/presenterModel");
    const existingPresenter = await Presenter.findOne({
      uuid: presenterUuid,
      deleted: false,
    }).exec();

    if (!existingPresenter) {
      res.status(500).json({ message: "Unable to validate Presenter." });
    }

    const BingoBoard = require("../models/bingoboardModel");
    const existingGameboard = await BingoBoard.findOne({
      owner: presenterUuid,
      uuid: gameboardUuid,
      deleted: false,
    }).exec();

    if (!existingGameboard) {
      res.status(500).json({message:'Unable to retreive expected Bingobard.'});
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
    const getGameboardUri = `https://${hostname}/api/v1/gameboard/${gameboardId}`;
    res.status(201);
    res.json({ message: getGameboardUri });
  } catch (error) {
    console.error(
      "adding gameboard to presenter profile failed.",
      error.message
    );
    res.status(500);
  }
}

module.exports = setGameboard;
