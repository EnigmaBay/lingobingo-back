async function validateCookies(req, res, next) {
  const { validateInputs } = require("../utils/validate-inputs");
  res.locals.cookieResult = "Unauthorized";

  const cookiesDefined = validateInputs(
    req.cookies["useruuid"],
    req.cookies["username"]
  );

  console.log("cookie-validator cookiesDefined", cookiesDefined);

  try {
    if (cookiesDefined) {
      const username = req.cookies["username"];
      const { validate } = require("../utils/presenter-utils");
      const presenter = await validate(req.cookies["useruuid"]);

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
        console.log("Cookie Validator: Invalid cookies in request.");
        res.status(401);
        next("Invalid cookies in request.");
      }
    } else {
      // res.locals.cookieResult = 'Unauthorized';
      console.log("Cookie Validator: Unrecognized cookies in request.");
      res.status(401);
      next("Unrecognized cookies in request.");
    }
  } catch (err) {
    console.log("cookie-validator threw", err.message);
    res.locals.cookieResult = "Unauthorized";
    res.status(500);
    next("err.message");
  }
  next();
}

module.exports = validateCookies;
