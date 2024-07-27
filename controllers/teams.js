const mongoose = require("mongoose");

const env = process.env
const Team = mongoose.model(env.TEAM_MODEL);

const getAll = function (request, response) {
    console.log("getAll controller");
    let offset = 0;
    let count = 5;

    if (request.query && request.query.offset) {
        offset = parseInt(request.query);
    }
    if (request.query.count) {
        count = parseInt(request.count);
    }
    Team.find().skip(offset).limit(count).exec(function (error, teams) {
        response.status(200).json(teams);
    });
}


module.exports = {
    getAll,
}