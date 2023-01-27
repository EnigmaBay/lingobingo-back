async function cookieSetter(req, res, next) {
  // test if presenterUuid is set and if not then find or create authenticated Presenter
  try {
    if (!req.user) {
      res.status(400).json({ message: "Unauthorized" });
    }

    const { generateUuid, store } = require("../utils/presenter-utils");

    const presenterUuid = await generateUuid(
      req.user.given_name,
      req.user.email,
      req.user.locale
    );

    console.log("cookie-setter got generated uuid", presenterUuid);

    const Presenter = require("../models/presenterModel");

    const findResult = await Presenter.findOne({
      uuid: presenterUuid,
    }).exec();

    if (findResult) {
      console.log(
        "cookie-setter called find presenter and got back",
        findResult
      );

      if (findResult.isDeleted) {
        console.log("presenter uuid has been blocked:", presenterUuid);
        res.status(400).json({ message: "Unauthorized" });
      } else {
        res.locals.presenterUuid = presenterUuid;
        set(req, res); // set new cookies
        res.status(200).json({ message: "Authorized" });
      }
    } else {
      // user uuid not already in database so go ahead and register it
      const addResult = await store(presenterUuid);
      console.log(
        "cookie-setter called presenter-utils.store() and it returned",
        addResult
      );
      console.log("cookie-setter registered a new Presenter", addResult);
      set(req, res); // set new cookie
      res.status(201).json({ message: "Authorized" });
    }
  } catch (error) {
    console.log("cookie-setter threw", error.message);
    res.status(500).json({ message: "Error" });
  }
  return;
}

function set(req, res) {
  const username = req.user.given_name;
  res.cookie("username", username, {
    maxAge: process.env.MAX_COOKIE_AGE,
    sameSite: "Strict",
  });
  console.log("cookie-setter username cookie set!");

  const presenterUuid = res.locals.presenterUuid;
  res.cookie("useruuid", presenterUuid, {
    maxAge: process.env.MAX_COOKIE_AGE,
    sameSite: "Strict",
  });
  console.log("cookie-setter uuid cookie set!");
}

module.exports = cookieSetter;
