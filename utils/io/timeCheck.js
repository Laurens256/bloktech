//maakt object met tijd van jaar tot seconde
const getAllDate = () => {
    const datumTest = new Date();
    const fullDate = {
        year: timeCheck(datumTest.getFullYear()),
        month: timeCheck(datumTest.getMonth() + 1),
        day: timeCheck(datumTest.getDate()),
        hour: timeCheck(datumTest.getHours()),
        minute: timeCheck(datumTest.getMinutes()),
        second: timeCheck(datumTest.getSeconds())
    }
    return fullDate;
}

//zorgt dat de tijd format altijd yyyy-mm-dd-uu-mm-ss is
function timeCheck(n) {
  return n < 10 ? "0" + n : n;
}

module.exports = { getAllDate };
