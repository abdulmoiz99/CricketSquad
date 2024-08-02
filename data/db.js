const mongoose = require("mongoose");
require("./team-model");
const callbackify = require("util").callbackify;
const env = process.env;

mongoose.connect(env.DB_URL);


const mongooseDisconnectWithCallback = callbackify(mongoose.disconnect)

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
    // console.log("Reaching SIGINT")
    // mongooseDisconnectWithCallback((error) => {
    //     if (error) {
    //         console.error("Error disconnecting mongoose:", error);
    //         process.exit(1);
    //     } else {
    //         console.log("Mongoose disconnected");
    //         process.exit(0);
    //     }
    // });
})
