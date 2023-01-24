const Presenter = require("../models/presenterModel");

async function validateCookies(req, res, next) {
  res.locals.cookieResult = "Unauthorized";

  const cookiesDefined = validateInputs(
    req.cookies["useruuid"],
    req.cookies["username"]
  );

  console.log("cookie-validator cookiesDefined", cookiesDefined);

  try {
    if (cookiesDefined) {
      const username = req.cookies["username"];
      const presenter = await validatePresenter(req.cookies["useruuid"]);

      if (presenter.uuid === req.cookies["useruuid"]) {
        const presenterUuid = presenter.uuid;

        res.cookie("username", username, {
          maxAge: process.env.MAX_COOKIE_AGE,
          sameSite: "Strict",
        });
        console.log("cookie-validator username cookie set!");

        res.cookie("useruuid", presenterUuid, {
          maxAge: process.env.MAX_COOKIE_AGE,
          sameSite: "Strict",
        });
        console.log("cookie-validator uuid cookie set!");

        res.locals.cookieResult = "Authorized";
        console.log("cookie-validator set authorized, now returning.");
      } else {
        res.locals.cookieResult = "Unauthorized";
      }
    }
  } catch (err) {
    console.log("cookie-validator threw", err.message);
  }
  next();
}

function validateInputs(useruuid, username) {
  console.log(
    "cookie-validator validateInputs received useruuid, username",
    useruuid,
    username
  );

  if (useruuid === undefined) {
    return false;
  }

  const uuidMatches = [...useruuid.matchAll(/([g-zG-Z])/g)];

  if (uuidMatches.length > 0) {
    return false;
  }

  if (useruuid.split("").length < 30) {
    return false;
  }

  if (username === undefined) {
    return false;
  }

  const usernameMatches = [...username.matchAll(/([a-zA-Z])/g)];

  if (usernameMatches.length < 1) {
    return false;
  }

  return true;
}

async function validatePresenter(useruuid) {
  const result = await Presenter.find({
    uuid: useruuid,
    deleted: false,
  }).exec();
  return result[0];
}

module.exports = validateCookies;
