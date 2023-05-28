const { checkString, validateEncodedArg } = require('../utils/validate-inputs');
const { validate } = require('../utils/presenter-utils');

async function validateCookies(req, res, next) {
  res.locals.cookieResult = 'Unauthorized';

  console.log('cookie-validator all cookies in req', req.cookies);

  const cookiesDefined =
    validateEncodedArg(req.cookies['useruuid']) &&
    validateEncodedArg(req.cookies['username']);

  console.log(
    'validateCookies ran validateEncodedArg (useruuid, username) and received:',
    cookiesDefined
  );
  console.log(
    'validateCookies useruuid, username from cookies',
    req.cookies['useruuid'],
    req.cookies['username']
  );

  try {
    if (cookiesDefined) {
      const username = checkString(req.cookies['username']);
      const presenter = await validate(req.cookies['useruuid']);
      console.log(
        'cookie-validator: validate(presenteruuid) returned:',
        presenter
      );

      if (presenter['uuid'] === req.cookies['useruuid']) {
        const presenterUuid = presenter['uuid'];

        res.cookie('username', username, {
          maxAge: process.env.MAX_COOKIE_AGE,
          sameSite: 'Strict',
        });
        console.log('cookie-validator username cookie set!');

        res.cookie('useruuid', presenterUuid, {
          maxAge: process.env.MAX_COOKIE_AGE,
          sameSite: 'Strict',
        });
        console.log('cookie-validator uuid cookie set!');
        res.locals.cookieResult = 'Authorized';
      } else {
        console.log('Cookie Validator: Invalid cookies in request.');
        res.locals.statusCode = 401;
        next('Invalid cookies in request.');
      }
    } else {
      console.log('Cookie Validator: Unrecognized cookies in request.');
      res.locals.statusCode = 401;
      next('Unrecognized cookies in request.');
    }
  } catch (err) {
    console.log('cookie-validator threw', err.message);
    res.locals.cookieResult = 'Unauthorized';
    res.locals.statusCode = 500;
    next('err.message');
  }
  next();
}

module.exports = validateCookies;
