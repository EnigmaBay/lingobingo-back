const { Buffer } = require('node:buffer');

async function decodeAuthParams(req, res, next) {
  console.log('decodeAuthParams received params (aka payload)', req.params);
  const payload = req.params.payload;
  const decodedPayload = Buffer.from(payload, 'base64url').toString('utf8');
  // nickname, email, username, emailVerified
  const payloadArr = decodedPayload.split(',');
  console.log('decodeAuthParams payloadArr is', payloadArr);
  res.locals.nickname = payloadArr[0];
  res.locals.email = payloadArr[1];
  res.locals.username = payloadArr[2];
  if (payloadArr[3] !== 'true') {
    console.log('decodeAuthParams: verification failed');
    next('Unverified email.');
  } else {
    console.log(
      'decodeAuthParams: Email verification check passed for user',
      res.locals.username
    );
    next();
  }
}

module.exports = decodeAuthParams;
