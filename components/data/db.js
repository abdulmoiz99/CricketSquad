const mongoose = require("mongoose");
require("../teams/teams.model");
require("../users/users.model");
const env = process.env;

mongoose.connect(process.env.DB_URL);

mongoose.connection.on("connected", function () {
    console.log("Mongoose connected to", env.DB_URL);
})

mongoose.connection.on("disconnected", function () {
    console.log("Mongoose disconnected");
})

mongoose.connection.on("error", function (error) {
    console.log("Mongoose error", error);
})

process.on("SIGINT", function () {
    mongoose.disconnect().then(process.exit(0));
})

process.on("SIGTERM", function () {
    mongoose.disconnect().then(process.exit(0));
})

process.on("SIGUSR2", function () {
    mongoose.disconnect().then(process.kill(process.pid, "SIGUSR2"));
})

