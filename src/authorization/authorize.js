// function utilizes authorization service to validate Auth Headers 'bearer token'
const jwt = require("jsonwebtoken"); // auth
const jwksClient = require("jwks-rsa"); // auth

// function from CodeFellows Code301 cy.2021 curriculum
function verifyUser(request, response, next) {
  const authHeader = request.headers.authorization;
  if (typeof authHeader !== 'string' || authHeader.valueOf().length < 7) {
    response.status(400).json({message:'Authorization header required.'});
    return;
  }

  function valid(err, user) {
    request.user = user;
    next();
  }

  try {
    const token = request.headers.authorization.split(" ")[1];
    console.log('authorize parsed token now calling jwt.verify');
    jwt.verify(token, getKey, {}, valid);
  } catch (error) {
    console.error(error);
    next('Not Authorized'); // by the book
  }
}

// helper function from jsonwebtoken docs https://www.npmjs.com/package/jsonwebtoken
const client = jwksClient({
  jwksUri: process.env.AUTH0_JWKS_URI,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

module.exports = verifyUser;
