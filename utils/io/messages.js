const { getAllDate } = require("./timeCheck.js");

function formatMessage(username, msg) {
  const allDate = getAllDate();
  return {
    naam: username,
    bericht: msg,
    time: allDate.hour + ":" + allDate.minute,
    tijdVolledig:
      allDate.year +
      allDate.month +
      allDate.day +
      allDate.hour +
      allDate.minute +
      allDate.second,
  };
}

module.exports = { formatMessage };