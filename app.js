require("dotenv").config();
require("./data/db")
const express = require("express");
const router = require("./router");

const app = express();
const env = process.env;

app.listen(env.PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    next();
});

app.use("/", router);

console.log("Server is listening on http://localhost:" + env.PORT)