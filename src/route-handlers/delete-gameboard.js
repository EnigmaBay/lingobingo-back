const Bingoboard = require("../models/bingoboardModel");
const Presenter = require("../models/presenterModel");
const { checkString } = require("../utils/validate-inputs");
const timeStamper = require("../utils/time-stamper");

async function deleteGameboard(req, res, next) {
  try {
    const owner = checkString(req.cookies["useruuid"]);
    const gameboardUuid = checkString(req.body["uuid"]);
    const foundPresenter = await Presenter.findOne({
      uuid: owner,
      deleted: false,
    }).exec();

    if (!foundPresenter) {
      res.locals.statusCode = 404; // todo: should be 500 server error?
      res.locals.resultMsg = "Not found.";
    } else {
      const timeStamp = timeStamper();

      const foundGameboard = await Bingoboard.updateOne(
        {
          uuid: gameboardUuid,
          owner: owner,
          idDeleted: false,
        },
        {
          isDeleted: true,
          updated: timeStamp,
        }
      );

      if (foundGameboard.modifiedCount < 1) {
        res.locals.statusCode = 404;
        res.locals.resultMsg = "Gameboard not found.";
      } else {
        const existingGameboards = foundPresenter.bingoboards;
        const updatedGameboards = [];

        existingGameboards.forEach((board) => {
          if (board !== gameboardUuid) {
            updatedGameboards.push(board);
          }
        });

        foundPresenter.bingoboards = updatedGameboards;
        foundPresenter.save();
        res.locals.statusCode = 200;
        res.locals.resultMsg = "Gameboard removed.";
      }
    }
  } catch (error) {
    console.error(error);
    res.locals.statusCode = 500;
    res.locals.resultMsg = "Error while deleting gameboard.";
  }
  next();
}

module.exports = deleteGameboard;
