const { Buffer } = require('node:buffer');

async function decodeAuthParams(req, res, next) {
  console.log('decodeAuthParams received', req.params);
  const payload = req.params.payload;
  console.log('received encodedPayload', payload);
  const decodedPayload = Buffer.from(payload, 'base64url').toString('utf8');
  // nickname, email, username, emailVerified
  const payloadArr = decodedPayload.split(',');
  console.log('payloadArr', payloadArr);
  res.locals.nickname = payloadArr[0];
  res.locals.email = payloadArr[1];
  res.locals.username = payloadArr[2];
  if (payloadArr[3] !== 'true') {
    console.log('verification failed');
    next('Unverified email.');
  } else {
    console.log(
      'email verification check passed for user',
      res.locals.username
    );
    next();
  }
}

module.exports = decodeAuthParams;
