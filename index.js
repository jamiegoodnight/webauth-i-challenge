const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.listen(5000, () => {
  console.log("\n*** Server Running on http://localhost:5000 ***\n");
});
