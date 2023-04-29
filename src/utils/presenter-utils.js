const Presenter = require("../models/presenterModel");
const { Buffer } = require("node:buffer");

// get presenter based on authorization token information
async function generateUuid(given_name, email, locale) {
  try {
    if (!given_name || !email || !locale) {
      return 400;
    } else {
      const concatInput = given_name + email + locale;
      const buf = Buffer.from(concatInput);
      return buf.toString("hex");
    }
  } catch (error) {
    console.error("generateUuid catch block triggered, returning 500");
    return 500;
  }
}

// set presenter stores the presenters uuid into the db
function store(presenterUuid) {
  const result = Presenter.findOne({
    uuid: presenterUuid,
    deleted: false,
  })
    .exec()
    .then((dbFindResult) => {
      if (dbFindResult) {
        return Promise.resolve(dbFindResult.uuid);
      } else {
        Presenter.create({
          uuid: presenterUuid,
        }).then((createResult) => {
          if (createResult) {
            return Promise.resolve(createResult.uuid);
          } else {
            console.error("presenter create failed, rejecting request.");
            return Promise.reject("Failed to create.");
          }
        });
      }
    })
    .catch((error) => console.error("presenter store failed. error:", error));

  return result;
}

async function validate(presenterUuid) {
  const Presenter = require("../models/presenterModel");
  const result = await Presenter.findOne({
    uuid: presenterUuid,
    deleted: false,
  }).exec();
  return result;
}

module.exports = {
  generateUuid,
  store,
  validate,
};
