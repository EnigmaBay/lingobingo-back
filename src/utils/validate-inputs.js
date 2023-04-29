function checkString(item) {
  if (typeof item === 'undefined') {
    return undefined;
  }

  if (typeof item === 'string') {
    if (item.length < 1) {
      return undefined;
    } else {
      return item.trim();
    }
  }

  // TODO: consider other necessary input validators and cleaners  
}

module.exports = checkString;
