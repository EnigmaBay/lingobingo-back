const Bingoboard = require("../models/bingoboardModel");
const Presenter = require("../models/presenterModel");
const { checkString } = require("../utils/validate-inputs");

async function deleteGameboard(req, res, next) {
  try {
    const owner = checkString(req.cookies["useruuid"]);
    const category = checkString(req.body["category"]);
    const foundPresenter = await Presenter.findOne({
      uuid: owner,
      isDeleted: false,
    }).exec();

    if (!foundPresenter) {
      res.locals.statusCode = 404;
      res.locals.resultMsg = "Not found.";
    } else {
      const timeStamper = require("../utils/time-stamper");
      const timeStamp = timeStamper();

      const updateGameboard = await Bingoboard.updateOne(
        {
          category: category,
          owner: owner,
          isDeleted: false,
        },
        {
          isDeleted: true,
          updated: timeStamp,
        }
      );

      if (updateGameboard.modifiedCount < 1) {
        res.locals.statusCode = 404;
        res.locals.resultMsg = "Gameboard not found.";
      } else {
        // gameboard was updated now the uuid is needed
        const foundGameboard = await Bingoboard.findOne({
          owner: owner,
          category: category,
          isDeleted: true,
        }).exec();

        if (foundGameboard) {
          // updated gameboard was found
          const gameboardUuid = foundGameboard["uuid"];
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
        } else {
          // gameboard was not found this is probably an error condition
          throw new Error("Gameboard was updated but could not be found?!?");
        }
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
