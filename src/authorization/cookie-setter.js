async function cookieSetter(req, res, next) {
  try {
    if (!req.user) {
      res.locals.statusCode = 401;
      res.locals.resultMsg = "Unauthorized.";
    } else {
      if (req.user.nickname && req.user.email && req.user.email_verified) {
        const { generateUuid, store } = require("../utils/presenter-utils");
        const concatenatedArgs = `${req.user.nickname}${req.user.email}${req.user.name}`;
        const presenterUuid = await generateUuid(concatenatedArgs);
        const maxCookieAge = process.env.MAX_COOKIE_AGE;
        const Presenter = require("../models/presenterModel");
        const findResult = await Presenter.findOne({
          uuid: presenterUuid,
        }).exec();

        if (findResult) {
          if (!findResult.isDeleted) {
            res.locals.presenterUuid = presenterUuid;
            set(res, req.user.nickname, presenterUuid, maxCookieAge); // set new cookie
            res.locals.statusCode = 200;
            res.locals.resultMsg = "Authorized.";
          } else {
            console.log(
              "presenter has been blocked:",
              presenterUuid
            );
            res.locals.statusCode = 403;
            res.locals.resultMsg = "Unauthorized.";
          }
        } else {
          // user uuid not already in database so go ahead and register it
          await store(presenterUuid);
          set(res, req.user.nickname, presenterUuid, maxCookieAge); // set new cookie
          res.locals.statusCode = 201;
          res.locals.resultMsg = "Authorized.";
        }
      } else {
        console.log(
          "cookie-setter detected missing property see following message(s)..."
        );
        console.log("nickname:", req.user.nickname);
        console.log("email:", req.user.email);
        console.log("email verified:", req.user.email_verified);
        res.locals.statusCode = 403;
        res.locals.resultMsg = "Requires Email Verification.";
      }
    }
  } catch (error) {
    console.log("cookie-setter threw", error.message);
    res.locals.statusCode = 500;
    res.locals.resultMsg = "Error.";
  }

  next();
}

function set(res, username, presenterUuid, maxCookieAge) {
  res.cookie("username", username, {
    maxAge: maxCookieAge,
    sameSite: "Strict",
  });
  res.cookie("useruuid", presenterUuid, {
    maxAge: maxCookieAge,
    sameSite: "Strict",
  });
}

module.exports = cookieSetter;
