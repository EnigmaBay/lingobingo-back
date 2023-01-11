function cookieValidator(useruuid) {

  if (useruuid === undefined) {
    return false;
  }
  const uuidMatches = [...useruuid.matchAll(/([g-zG-Z])/g)];

  if (uuidMatches.length > 0) {
    return false;
  }

  if (useruuid.split('').length < 30) {
    return false;
  }

  // since authentication is handled on the front-end this module
  // avoids storing or passing user information other than uuid
  return true;
}

module.exports = cookieValidator;
