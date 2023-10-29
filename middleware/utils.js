const { format } = require("date-fns");
const dayjs = require("dayjs");

const sortArticles = (sort) => {
  let SortArgs = { sortBy: "_id", order: "asc", limit: 5, skip: 0 };
  for (key in sort) {
    if (sort[key]) {
      SortArgs[key] = sort[key];
    }
  }
  return SortArgs;
};

function generateRandomString(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  const numbers = "0123456789";
  const numbersLength = numbers.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numbersLength);
    const charIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(charIndex);

    result += numbers.charAt(randomIndex);
  }

  return result;
}

function isTimeBetween(startTime, endTime, checkTime) {

  const startDate = new Date();
  const endDate = new Date();
  const checkDate = new Date();

  startDate.setHours(startTime.split(":")[0]);
  startDate.setMinutes(startTime.split(":")[1]);

  endDate.setHours(endTime.split(":")[0]);
  endDate.setMinutes(endTime.split(":")[1]);

  checkDate.setHours(checkTime.split(":")[0]);
  checkDate.setMinutes(checkTime.split(":")[1]);

  return checkDate >= startDate && checkDate <= endDate;
}

module.exports = { sortArticles, generateRandomString, isTimeBetween };
