function cookieValidator(req, res, next) {
  res.locals.cookieResult = false;
  res.status(500);

  // test if presenterUuid is set and if not then find or create Presenter failed so do not set new cookies
  try {
    if (res.locals.presenterUuid !== undefined) {
      const userUuid = res.locals.presenterUuid;
      const uuidMatches = [...userUuid.matchAll(/([g-zG-Z])/g)];

      // hex values do not include alpha characters g through z
      if (uuidMatches.length === 0) {

        if (userUuid.split("").length > 29) {
          res.cookie("useruuid", userUuid, {
            maxAge: process.env.MAX_COOKIE_AGE,
          });
          res.cookie("username", req.user.given_name, {
            maxAge: process.env.MAX_COOKIE_AGE,
          });
          res.status(200);
          res.locals.cookieResult = true;
        }
      }
    }
  } catch (error) {
    console.log("cookieValidate catch block error:", error);
    res.status(500);
    res.locals.cookieResult = false;
  }
}

module.exports = cookieValidator;
