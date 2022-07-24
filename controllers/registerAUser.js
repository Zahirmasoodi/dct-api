const path = require("path");
const fs = require("fs");

const RegisterAUser = (req, res, next) => {
  const data = req.body;

  console.log("Body ", req.body);

  const userFilePath = path.resolve(__dirname, "../db", "user.json");
  let userFileObj = JSON.parse(fs.readFileSync(userFilePath, "utf8"));

  const treeFilePath = path.resolve(__dirname, "../db", "tree.json");
  let treeFileObj = JSON.parse(fs.readFileSync(treeFilePath, "utf8"));

  let userFileArr = userFileObj.users;

  let user_name_exists = false;

  if (data.username) {
    userFileArr.forEach((user) => {
      if (user.username.toLowerCase() === data.username.toLowerCase()) {
        user_name_exists = true;
      }
    });

    if (user_name_exists) {
      res.status(200).json({
        message: "Username not avaialable. Please try a different username.",
      });

      return;
    }
  } else {
    res.status(200).json({
      message: "Username can not be empty.",
    });

    return;
  }

  let sponsor_user_name_exists = false;
  userFileArr.forEach((user) => {
    if (user.username.toLowerCase() === data.sponsorUsername.toLowerCase()) {
      sponsor_user_name_exists = true;
    }
  });

  if (!sponsor_user_name_exists) {
    res.status(200).json({
      message: "Please select a valid Sponsor.",
    });

    return;
  }

  let sponsor_level = -1;
  let sponsor_level_index = -1;
  let left = "";
  let right = "";

  userFileArr.forEach((user) => {
    if (user.username.toLowerCase() === data.sponsorUsername.toLowerCase()) {
      left = treeFileObj.tree[user.level][(user.levelIndex - 1) * 2];
      right = treeFileObj.tree[user.level][(user.levelIndex - 1) * 2 + 1];

      sponsor_level = user.level;
      sponsor_level_index = user.levelIndex;
    }
  });

  if (left !== "" && right !== "") {
    res.json({
      message: "Please select a different Sponsor.",
    });

    return;
  } else if (data.position == "left") {
    if (left !== "") {
      res.json({
        message: "Only Right position available.",
      });

      return;
    }
  } else if (data.position == "right") {
    if (right !== "") {
      res.json({
        message: "Only Left position available.",
      });

      return;
    }
  } else {
    res.json({
      message: "Please specify a position.",
    });

    return;
  }

  let user_level_index = -1;
  if (data.position == "left") {
    treeFileObj.tree[sponsor_level][(sponsor_level_index - 1) * 2] =
      data.username;
    user_level_index = sponsor_level_index * 2 - 1;
  } else if (data.position == "right") {
    treeFileObj.tree[sponsor_level][(sponsor_level_index - 1) * 2 + 1] =
      data.username;
    user_level_index = sponsor_level_index * 2;
  }

  if (typeof treeFileObj.tree[sponsor_level + 1] === "undefined") {
    treeFileObj.tree.push([]);

    const next_level_children = 2 ** (sponsor_level + 1);

    for (let i = 0; i < next_level_children; i++) {
      treeFileObj.tree[sponsor_level + 1].push("");
    }
  }

  treeFileObj = JSON.stringify(treeFileObj, null, 4);
  fs.writeFile(treeFilePath, treeFileObj, (err) => {
    if (err) {
      return res.status(500).json({
        message: "User not registered. Please try again.",
      });
    }
  });

  const userObj = {
    name: data.name,
    username: data.username,
    sponsorUsername: data.sponsorUsername,
    position: data.position,
    level: sponsor_level + 1,
    levelIndex: user_level_index,
  };

  userFileObj.users.push(userObj);
  userFileObj = JSON.stringify(userFileObj, null, 4);

  fs.writeFile(userFilePath, userFileObj, (err) => {
    if (err) {
      return res.status(500).json({
        message: "User not registered. Please try again.",
      });
    }
  });

  res.status(200).json({
    message: "User registered successfully.",
  });

  return;
};

module.exports = RegisterAUser;
