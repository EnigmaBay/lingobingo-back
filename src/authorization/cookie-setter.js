function cookieSetter(req, res, next) {
  res.locals.cookieResult = false;
  res.status(500);

  // test if presenterUuid is set and if not then find or create authenticated Presenter
  try {
    console.log('cookieSetter checking if res.locals.presenterUuid is defined AND res.locals.authenticated is true')
    if (res.locals.presenterUuid !== undefined && res.locals.authenticated) {
      console.log('cookieSetter verified locals.presenterUuid is defined and locals.authenticated is true.');
      const userUuid = res.locals.presenterUuid;
      const uuidMatches = [...userUuid.matchAll(/([g-zG-Z])/g)];

      // hex values do not include alpha characters g through z
      if (uuidMatches.length === 0) {
        console.log('cookieSetter uuidMatches says no invalid characters in userUuid.');
        if (userUuid.split("").length > 29) {
          console.log('cookieSetter userUuid split length was greater than 29.');
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
    console.log("cookie-setter catch block error:", error);
    res.status(500);
    res.locals.cookieResult = false;
  }
}

module.exports = cookieSetter;
