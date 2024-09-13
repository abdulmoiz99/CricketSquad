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
    res.header(env.ACCESS_CONTROL_ALLOW_ORIGIN, env.FRONT_ENT_URL);
    res.header(env.ACCESS_CONTROL_ALLOW_HEADERS, 'content-type, authorization');
    res.header(env.ACCESS_CONTROL_ALLOW_METHODS, 'DELETE');
    next();
});

app.use("/api", router);

console.log(env.SERVER_IS_LISTENING_TO_MESSAGE + env.PORT)