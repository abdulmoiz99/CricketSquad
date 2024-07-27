const mongoose = require("mongoose");

const env = process.env
const Team = mongoose.model(env.TEAM_MODEL);

const addOne = function (request, response) {
    console.log("addOne controller");

    const newTeam = {
        country: request.body.country,
        yearEstablished: request.body.yearEstablished,
        totalWorldCupWon: request.body.totalWorldCupWon,
        player: request.body.players.map(player => ({
            name: player.name,
            age: player.age,
            yearJoined: player.yearJoined
        }))
    };

    Team.create(newTeam, function (error, team) {
        if (error) {
            console.log(error);
            response.status(500).json({ error: "Internal Server Error" });
        } else {
            response.status(200).json(team);
        }
    });
}



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
const getOne = function (request, response) {
    console.log("getOne controller");

    const teamId = request.params.Id;
    Team.findById(teamId).exec(function (error, teams) {
        response.status(200).json(teams);
    });
}

const deleteOne = function (request, response) {
    console.log("deleteOne controller");
    const teamId = request.params.Id;
    Team.deleteOne({ _id: teamId }).exec(function (error, teams) {
        if (error) {
            console.log(error);
        }
        else response.status(200).json(teams);
    });
}

module.exports = {
    getAll,
    getOne,
    deleteOne,
    addOne,
}