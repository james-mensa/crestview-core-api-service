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

module.exports = { sortArticles, generateRandomString };
