const mongoose = require("mongoose");
const responseHelper = require("../Utility/responseHelper");
const responseHandler = require("../Utility/responseHandler");

const env = process.env
const Team = mongoose.model(env.TEAM_MODEL);

let _responseObj = {}


const _validateTeamId = function (teamId) {
    return new Promise((resolve, reject) => {
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            reject(new Error(env.PROVIDE_VALID_TEAM_ID));
        } else {
            resolve(teamId);
        }
    });
}
const _validateTeamLength = function (team) {
    return new Promise((resolve, reject) => {
        if (!team || team.length === 0) {
            reject(new Error(env.NO_RECORD_FOUND))
        }
        else resolve(team);
    })
}
const _validatePlayer = function (team, playerId) {
    return new Promise((resolve, reject) => {
        const deletedPlayer = team.players.id(playerId);
        if (!deletedPlayer) {
            reject(new Error(env.NO_RECORD_FOUND))
        }
        resolve(team);
    })
}
const _validateTeam = function (team) {
    return new Promise((resolve, reject) => {
        if (team == null)
            reject(new Error(env.TEAM_NOT_FOUND));
        else resolve(team)
    })
}
const _sendResponse = function (response, responseObj) {
    return response.status(responseObj.statusCode).json(responseObj.result)
}

const getAll = function (request, response) {
    console.log("players getAll")

    const teamId = request.params.Id;

    _validateTeamId(teamId)
        .then(id => { return Team.findById(id) })
        .then(team => _validateTeamLength(team))
        .then(team => _responseObj = responseHandler.getSuccessResponse(team.players))
        .catch(error => { _responseObj = responseHandler.getErrorResponse(error) })
        .finally(_ => _sendResponse(response, _responseObj))
}

const deleteOne = function (request, response) {
    console.log("players deleteOne controller");
    const teamId = request.params.teamId;
    const playerId = request.params.playerId;

    Team.findById(teamId)
        .then(team => _validatePlayer(team, playerId))
        .then(team => Team.findByIdAndUpdate(team, { $pull: { players: { _id: playerId } } }))
        .then(team => _responseObj = responseHandler.getSuccessResponseWithMessage(env.PLAYER_DELETED_SUCCESSFULLY, {}))
        .catch(error => { _responseObj = responseHandler.getErrorResponse(error) })
        .finally(_ => _sendResponse(response, _responseObj))
}

const addOne = function (request, response) {
    console.log("players addOne controller");
    const teamId = request.params.Id;

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
        _responseObj = responseHandler.getCustomResponse(env.BAD_REQUEST, env.MISSING_REQUEST_BODY, false)
        return _sendResponse(response, _responseObj)
    }
    _validateTeamId(teamId)
        .then(teamId => { return Team.findById(teamId) })
        .then(team => _validateTeam(team))
        .then(team => {
            team.players.push(newPlayer);
            team.save();
        })
        .then(_ => _responseObj = responseHandler.getSuccessResponseWithMessage(env.PLAYER_ADDED_SUCCESSFULLY, {}))
        .catch(error => { _responseObj = responseHandler.getErrorResponse(error) })
        .finally(_ => _sendResponse(response, _responseObj))
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

    return Team.findOneAndUpdate(filter, update)
        .then(team => responseHelper.sendSuccess(response, env.PLAYER_UPDATED_SUCCESSFULLY))
        .catch(error => responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR))


    // TeamUpdateOneExecCallback(teamId, playerId, updatedPlayer, function (error, teams) {
    //     if (error) {
    //         return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);
    //     }
    //     else if (!teams || teams.length === 0) {
    //         return responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND);
    //     }
    //     return responseHelper.sendSuccess(response, env.PLAYER_UPDATED_SUCCESSFULLY);
    // })
}

module.exports = {
    getAll,
    deleteOne,
    addOne,
    updateOne,
}