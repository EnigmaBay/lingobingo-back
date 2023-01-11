const Presenter = require('../models/presenterModel');
const { Buffer } = require('node:buffer');

// get presenter based on authorization token information
async function getId(oidc) {
  try {
    const { given_name, email, locale } = oidc;
    if (!given_name || !email || !locale) {
      return 400;
    } else {
      const concatInput = given_name + email + locale;
      const buf = Buffer.from(concatInput);
      return buf.toString('hex');
    }
  } catch (error) {
    return 500;
  }
}

// set presenter stores the presenters uuid into the db
async function storeId(encodedId) {
  try {
    const findResult = await Presenter.find({ uuid: encodedId }).exec();

    if (!findResult[0]) {
      const addedItem = await Presenter.create({ uuid: encodedId });
    }

    return encodedId;
  } catch (error) {
    console.log('Failed to add presenter id to db. ', error);
  }
}

// add gameboard to presenter. Returns gameboard uuid if sucessfull, -1 if not.
async function addGameboard(presenterId, gameboardId) {
  try {
    const existingPresenter = await Presenter.find({
      uuid: presenterId
    }).exec();

    if (!existingPresenter[0]) {
      return -1;
    } else {
      const existingBingoboards = existingPresenter[0].bingoboards;
      existingPresenter[0].bingoboards.push(gameboardId);
      const updatedPresenter = await existingPresenter[0].save();
      return gameboardId;
    }
  } catch (error) {
    console.log('adding gameboard to presenter profile failed. ', error);
  }
}

module.exports = {
  getId,
  storeId,
  addGameboard
};
