const db = require("../database/dbConfig.js");

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  getUserById
};

function getAllUsers() {
  return db("users").select("id", "username", "password");
}

function getUser(filter) {
  return db("users").where(filter);
}

function addUser(user) {
  return db("users")
    .insert(user)
    .then(ids => {
      return getUserById(ids[0]);
    });
}

function getUserById(id) {
  return db("users")
    .where({ id })
    .first();
}
