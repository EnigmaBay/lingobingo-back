const Presenter = require("../models/presenterModel");

function validateCookies(req, res, next) {
  const cookiesDefined = validateInputs(
    req.cookies["useruuid"],
    req.cookies["username"]
  );

  if (!cookiesDefined) {
    res.status(401);
    res.json({ message: "Reauthentication needed." });
  } else {
    validatePresenter(req.cookies["useruuid"])
      .then((resolution) => resolution === req.cookies["useruuid"])
      .then((presenter) => {
        res.cookie("useruuid", req.cookies["useruuid"], {
          maxAge: process.env.MAX_COOKIE_AGE,
        });
        res.cookie("username", req.cookies["username"], {
          maxAge: process.env.MAX_COOKIE_AGE,
        });
        console.log("Cookies set for validated presenter:", presenter);
      })
      .catch(res.status(401).json({ message: "Registration required." }));

    // if (!presenterIsValid) {
    //   res.status(401);
    //   res.json({ message: "Registation required." });
    // }

    // function setCookies() {
    //   res.cookie("useruuid", req.cookies["useruuid"], {
    //     maxAge: process.env.MAX_COOKIE_AGE,
    //   });
    //   res.cookie("username", req.cookies["username"], {
    //     maxAge: process.env.MAX_COOKIE_AGE,
    //   });
    // }

    // setCookies();
    next();
  }
}

function validateInputs(useruuid, username) {
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
    .catch((error) =>
      console.error("Database error while searching for Presenter:", error)
    );

  return result;
}

module.exports = validateCookies;
