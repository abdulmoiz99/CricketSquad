require("dotenv").config();
require("./data/db")
const express = require("express");

const app = express();
const env = process.env;

app.listen(env.PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


console.log("Server is listening on http://localhost:" + env.PORT)