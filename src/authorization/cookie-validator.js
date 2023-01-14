const Presenter = require("../models/presenterModel");

function validateCookies(req, res, next) {
  console.log('entered validateCookies middleware.');
  console.log('validateCookies useruuid, username:', req.cookies['useruuid'], req.cookies['username']);

  const cookiesDefined = validateInputs(
    req.cookies["useruuid"],
    req.cookies["username"]
  );

  if (!cookiesDefined) {
    console.log('cookiesDefined was false!');
    res.status(401);
    res.json({ message: "Reauthentication needed." });
  }

  const presenterIsValid = validatePresenter(req.cookies["useruuid"])
    .then((resolution) => resolution === req.cookies["useruuid"])
    .catch((value) => false);

  if (!presenterIsValid) {
    res.status(401);
    res.json({ message: "Registation required." });
  }

  function setCookies() {
    res.cookie("useruuid", req.cookies["useruuid"], {
      maxAge: process.env.MAX_COOKIE_AGE,
    });
    console.log('cookies-validator setCookies setting user given name:', req.cookies['username']);
    res.cookie("username", req.cookies['username'], {
      maxAge: process.env.MAX_COOKIE_AGE,
    });
  }

  setCookies();
  next();
}

function validateInputs(useruuid, username) {
  console.log('cookie-validator validateInputs received', useruuid, username);
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

function validatePresenter(useruuid) {
  const result = Presenter.find({
    uuid: useruuid,
    deleted: false,
  })
    .exec()
    .then((dbFindResult) => {
      if (dbFindResult[0]) {
        return Promise.resolve(dbFindResult[0].uuid);
      } else {
        return Promise.reject("Presenter not found.");
      }
    })
    .catch((error) => console.log(error));

  return result;
}

module.exports = validateCookies;
