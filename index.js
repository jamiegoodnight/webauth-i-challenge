const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

const db = require("./users/users-model.js");

server.post("/api/register", (req, res) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  if (user.username && user.password) {
    db.addUser(user)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "There was a problem saving this user!" });
      });
  } else {
    res
      .status(401)
      .json({
        message: "Please provide a username and a password for this user!"
      });
  }
});

server.post("/api/login", (req, res) => {});

server.get("/api/users", restricted, (req, res) => {});

const restricted = () => {};

server.listen(5000, () => {
  console.log("\n*** Server Running on http://localhost:5000 ***\n");
});
