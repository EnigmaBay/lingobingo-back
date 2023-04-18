const { Buffer } = require('node:buffer');

async function decodeAuthJson(req, res, next) {
  console.log('decodeAuthJson received', req.body.payload);
  const payload = req.body.payload;
  console.log('received encodedPayload', payload);
  const decodedPayload = Buffer.from(payload, 'base64url').toString('utf8');
  console.log('decodeJson() decodedPayload', decodedPayload);
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
    console.log('verification passed for username', res.locals.username);
    next();
  }
}

module.exports = decodeAuthJson;
