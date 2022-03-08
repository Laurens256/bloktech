// const convertTime12to24 = () => {
//   const datum = new Date();
//   const timeHHMM = datum.toLocaleTimeString();
//   const [time, modifier] = timeHHMM.split(" ");

//   let [hours, minutes] = time.split(":");

//   if (hours === "12") {
//     hours = "00";
//   }

//   if (modifier === "PM") {
//     hours = parseInt(hours, 10) + 12;
//   }

//   return hours + ":" + minutes;
// };

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

function timeCheck(n) {
  return n < 10 ? "0" + n : n;
}

module.exports = { getAllDate };
