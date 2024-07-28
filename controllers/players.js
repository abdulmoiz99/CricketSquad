const mongoose = require("mongoose");
const responseHelper = require("../responseHelper");
const callbackify = require("util").callbackify

const env = process.env
const Team = mongoose.model(env.TEAM_MODEL);

const TeamFindByIdExecCallback = callbackify(function (teamId) {
    return Team.findById(teamId).exec();
})
const TeamFindByIdAndUpdateExecCallBack = callbackify(function (id, player) {
    return Team.findByIdAndUpdate(id, player).exec();
})

const TeamSaveCallBack = callbackify(function (teams) {
    return teams.save();
})


const getAll = function (request, response) {
    console.log("players getAll")

    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, 400, process.env.PROVIDE_VALID_TEAM_ID);
    }

    TeamFindByIdExecCallback(teamId, function (error, teams) {

        if (error) {
            return responseHelper.sendError(response, 500, process.env.INTERNAL_SERVER_ERROR);
        }
        else if (!teams || teams.length === 0) {
            return responseHelper.sendError(response, 404, process.env.NO_RECORD_FOUND);
        }
        return response.status(200).json(teams);
    });
}

const deleteOne = function (request, response) {
    console.log("players deleteOne controller");
    const teamId = request.params.teamId;
    const playerId = request.params.playerId;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, 400, process.env.PROVIDE_VALID_TEAM_ID);
    }
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
        return responseHelper.sendError(response, 400, process.env.PROVIDE_VALID_PLAYER_ID);
    }
    TeamFindByIdExecCallback(teamId, function (err, teams) {
        if (err)
            res.status(500).json({ message: err });
        else if (teams == null)
            res.status(404).json({ message: 'restaurant not found!' });
        else {
            const deletedPlayer = teams.players.id(playerId);
            if (!deletedPlayer) {
                return responseHelper.sendError(response, 404, process.env.NO_RECORD_FOUND);
            }

            TeamFindByIdAndUpdateExecCallBack(teams, { $pull: { players: { _id: playerId } } }, function (error, player) {
                if (error) {
                    console.log(error);
                    response.status(500).json({ error: "Internal Server Error" });
                } else {
                    response.status(200).json(deletedPlayer);
                }
            });
        }
    })

}


const addOne = function (request, response) {
    console.log("players addOne controller");
    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, 400, process.env.PROVIDE_VALID_TEAM_ID);
    }
    const newPlayer = {
        name: request.body.name,
        age: request.body.age,
        yearJoined: request.body.yearJoined,
    };

    TeamFindByIdExecCallback(teamId, function (err, teams) {
        if (err)
            res.status(500).json({ message: err });
        else if (teams == null)
            res.status(404).json({ message: 'restaurant not found!' });
        else {
            teams.players.push(newPlayer);
            TeamSaveCallBack(teams, function (error, player) {
                if (error) {
                    console.log(error);
                    response.status(500).json({ error: "Internal Server Error" });
                } else {
                    response.status(200).json(player);
                }
            });
        }
    })

}

module.exports = {
    getAll,
    deleteOne,
    addOne,
}