const mongoose = require("mongoose");
const responseHelper = require("../Utility/responseHelper");
const callbackify = require("util").callbackify

const env = process.env
const Team = mongoose.model(env.TEAM_MODEL);

const TeamFindByIdExecCallback = callbackify(function (teamId) {
    return Team.findById(teamId).exec();
})

const TeamSaveCallBack = callbackify(function (teams) {
    return teams.save();
})
const TeamUpdateOneExecCallback = callbackify(function (teamId, playerId, updatedPlayer) {
    const filter = { _id: teamId, "players._id": playerId };
    const update = {};

    if (updatedPlayer.name !== null) {
        update["players.$.name"] = updatedPlayer.name;
    }
    if (updatedPlayer.age !== null) {
        update["players.$.age"] = updatedPlayer.age;
    }
    if (updatedPlayer.yearJoined !== null) {
        update["players.$.yearJoined"] = updatedPlayer.yearJoined;
    }

    return Team.findOneAndUpdate(filter, update);
})

const getAll = function (request, response) {
    console.log("players getAll")

    const teamId = request.params.Id;

    _validateTeamId(teamId)
        .then(id => { return Team.findById(id) })
        .catch(error => responseHelper.sendError(response, env.NOT_FOUND, env.PROVIDE_VALID_TEAM_ID))
        .then(team => _validateTeamLength(team))
        .catch(error => responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND))
        .then(team => responseHelper.sendSuccess(response, team.players))
        .catch(error => responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR))
}

const _validateTeamId = function (teamId) {
    return new Promise((resolve, reject) => {
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            reject();
        }
        else {
            resolve(teamId)
        }
    })
}
const _validateTeamLength = function (team) {
    return new Promise((resolve, reject) => {
        if (!team || team.length === 0) {
            reject()
        }
        else resolve(team);
    })
}
const _validatePlayer = function (team, playerId) {
    return new Promise((resolve, reject) => {
        const deletedPlayer = team.players.id(playerId);
        if (!deletedPlayer) {
            console.log("Invalid player")
            reject()
        }
        resolve(team);
    })
}
const deleteOne = function (request, res) {
    console.log("players deleteOne controller");
    const teamId = request.params.teamId;
    const playerId = request.params.playerId;

    Team.findById(teamId)
        .then(team => _validatePlayer(team, playerId))
        .then(team => Team.findByIdAndUpdate(team, { $pull: { players: { _id: playerId } } }))
        .catch(() => {
            console.log("Reached First Catch")
            responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND)
        })
        .then(player => responseHelper.sendSuccess(response, env.PLAYER_DELETED_SUCCESSFULLY))
        .catch(error => {
            console.log("Reached Second Catch")
            res.status(500).json({ message: error })
        })
}
const _validateTeam = function (team) {
    return new Promise((resolve, reject) => {
        if (team == null)
            reject()
        else resolve(team)
    })
}
const addOne = function (request, response) {
    console.log("players addOne controller");
    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.PROVIDE_VALID_TEAM_ID);
    }
    const newPlayer = {};
    if (request.body && Object.keys(request.body).length != 0) {
        if (request.body.name !== null) {
            newPlayer.name = request.body.name;
        }
        if (request.body.age !== null) {
            newPlayer.age = request.body.age;
        }
        if (request.body.yearJoined !== null) {
            newPlayer.yearJoined = request.body.yearJoined;
        }
    }
    else {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.MISSING_REQUEST_BODY);
    }

    Team.findById(teamId)
        .then(team => _validateTeam(team))
        .then(team => {
            team.players.push(newPlayer);
            team.save();
        })
        .then(_ => responseHelper.sendSuccess(response, player))
        .catch(error => responseHelper.sendError(response, env.NOT_FOUND, env.TEAM_NOT_FOUND))
        .catch(error => responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR))


    // TeamFindByIdExecCallback(teamId, function (error, teams) {
    //     if (error) {
    //         console.log()
    //         return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);
    //     }
    //     else if (teams == null)
    //         return responseHelper.sendError(response, env.NOT_FOUND, env.TEAM_NOT_FOUND);
    //     else {
    //         teams.players.push(newPlayer);
    //         TeamSaveCallBack(teams, function (error, player) {
    //             if (error) {
    //                 console.log(error);
    //                 return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);

    //             } else {
    //                 return responseHelper.sendSuccess(response, player);
    //             }
    //         });
    //     }
    // })

}


const updateOne = function (request, response) {
    console.log("updateOne player controller");

    const teamId = request.params.teamId;
    const playerId = request.params.playerId;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.PROVIDE_VALID_TEAM_ID);
    }

    if (!mongoose.Types.ObjectId.isValid(playerId)) {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.PROVIDE_VALID_TEAM_ID);
    }

    const updatedPlayer = {};
    if (request.body && Object.keys(request.body).length != 0) {
        if (request.body.name !== null) {
            updatedPlayer.name = request.body.name;
        }
        if (request.body.age !== null) {
            updatedPlayer.age = request.body.age;
        }
        if (request.body.yearJoined !== null) {
            updatedPlayer.yearJoined = request.body.yearJoined;
        }
    }
    else {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.MISSING_REQUEST_BODY);
    }

    TeamUpdateOneExecCallback(teamId, playerId, updatedPlayer, function (error, teams) {
        if (error) {
            return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);
        }
        else if (!teams || teams.length === 0) {
            return responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND);
        }
        return responseHelper.sendSuccess(response, env.PLAYER_UPDATED_SUCCESSFULLY);
    })
}

module.exports = {
    getAll,
    deleteOne,
    addOne,
    updateOne,
}