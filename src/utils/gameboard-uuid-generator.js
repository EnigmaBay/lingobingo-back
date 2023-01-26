function generateGameboardUuid(concatenatedStrings) {
  try {
    const concatInput = concatenatedStrings.trim();
    const buf = Buffer.from(concatInput);
    return buf.toString("hex");
  } catch (error) {
    console.log(
      "add-gameboard generateUuid catch block triggered.",
      error.message
    );
  }

  return undefined;
}

module.exports = generateGameboardUuid;
