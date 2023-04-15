async function cookieSetter(req, res, next) {
  const maxCookieAge = process.env.MAX_COOKIE_AGE;

  try {
    res.cookie('username', res.locals.username, {
      maxAge: maxCookieAge,
      sameSite: 'Strict',
    });
    res.cookie('useruuid', res.locals.presenterUuid, {
      maxAge: maxCookieAge,
      sameSite: 'Strict',
    });
  } catch (error) {
    console.log('cookie-setter threw:', error.message);
    next('Unable to set cookies.');
  }

  next();
}

module.exports = cookieSetter;
