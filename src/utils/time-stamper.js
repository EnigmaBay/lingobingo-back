function timeStamper() {
  const dateNow = new Date(Date.now());
  console.log('timeStamper will return', dateNow);
  return dateNow;
}

module.exports = timeStamper;
