const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASEURL,
});

const checkScopes = requiredScopes('read:categories');

module.exports = { checkJwt, checkScopes };
