const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

const db = require("./users/usersModel.js");

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
    res.status(401).json({
      message: "Please provide a username and a password for this user!"
    });
  }
});

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    db.getUserByName({ username })
      .then(user => {
        if (bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: "LOGGED IN" });
          next();
        } else {
          res.status(401).json({ message: "Invalid username or password!" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "There was a problem logging in!" });
      });
  } else {
    res
      .status(401)
      .json({ message: "Please provide a username and password to login!" });
  }
});

server.get("/api/users", restricted, (req, res) => {
  db.getAllUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was a problem retrieving users!" });
    });
});

function restricted(req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
    db.getUserByName({ username })
      .then(user => {
        if (bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "There was a problem logging in!" });
      });
  } else {
    res
      .status(401)
      .json({ message: "Please provide a username and password to login!" });
  }
}

server.listen(5000, () => {
  console.log("\n*** Server Running on http://localhost:5000 ***\n");
});
