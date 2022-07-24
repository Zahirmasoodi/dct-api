const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getAllUsers = require("./controllers/getAllUsers");
const registerAUser = require("./controllers/registerAUser");

app.get("/get-all-users", getAllUsers);
app.post("/register-a-user", registerAUser);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
