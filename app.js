require("dotenv").config();
require("./components/data/db")
const express = require("express");
const router = require("./components/router");

const app = express();
const env = process.env;

app.listen(env.PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'content-type, authorization');
    next();
});

app.use("/api", router);

console.log("Server is listening on http://localhost:" + env.PORT)