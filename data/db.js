const mongoose = require("mongoose");
require("./team-model");
const env = process.env;


mongoose.connect(env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", function () {
    console.log("mongoose connected to", env.DB_URL);
})

mongoose.connection.on("disconnect", function () {
    console.log("mongoose disconnected");
})
mongoose.connection.on("error", function (error) {
    console.log("mongoose connection error", error);
})

process.on("SIGINT", function () {
    console.log("Reaching SIGINT")
    mongoose.disconnect(function () {
        process.exit();
    })
})
