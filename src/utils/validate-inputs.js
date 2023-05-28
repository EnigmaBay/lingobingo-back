function checkString(item) {
  if (typeof item === "undefined") {
    return undefined;
  }

  if (typeof item === "string") {
    if (item.length < 1) {
      return undefined;
    } else {
      return item.trim();
    }
  }
}

function validateEncodedArg(b64urlInput) {
  console.log("validate-inputs validateEncodedArg received");
  if (!checkString(b64urlInput)) {
    return false;
  }

  const buff = Buffer.from(b64urlInput, "base64url");
  const decoded = buff.toString("utf8");

  if (decoded.length < 2) {
    return false;
  }
  const matches = [...decoded.matchAll(/\s/g)];

  if (matches.length === decoded.length) {
    return false;
  }

  return true;
}

function validateInputs(useruuid, username) {
  console.log("validateInputs received useruuid, username.");

  if (useruuid === undefined) {
    return false;
  }

  const uuidMatches = [...useruuid.matchAll(/([g-zG-Z])/g)];

  if (uuidMatches.length > 0) {
    return false;
  }

  if (useruuid.split("").length < 30) {
    return false;
  }

  if (username === undefined) {
    return false;
  }

  const usernameMatches = [...username.matchAll(/([a-zA-Z])/g)];

  if (usernameMatches.length < 1) {
    return false;
  }

  return true;
}

module.exports = { checkString, validateInputs, validateEncodedArg };
