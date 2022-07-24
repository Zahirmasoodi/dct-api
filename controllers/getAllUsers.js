const path = require("path");
const fs = require("fs");

const getAllUsers = async (req, res, next) => {
  const userFilePath = path.resolve(__dirname, "../db", "user.json");
  const userFileObj = JSON.parse(fs.readFileSync(userFilePath, "utf8"));
  const data = await userFileObj.users;

  const user_name_mapping = data.reduce((acc, user, i) => {
    acc[user.username] = i;
    return acc;
  }, {});

  let root;
  data.forEach((user) => {
    if (user.sponsorUsername === null) {
      root = user;
      return;
    }

    const parentEl = data[user_name_mapping[user.sponsorUsername]];
    parentEl.children = [...(parentEl.children || []), user];
  });

  res.send(root);
};

module.exports = getAllUsers;
