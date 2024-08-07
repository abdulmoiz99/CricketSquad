const mongoose = require("mongoose");
const responseHelper = require("../Utility/responseHelper");

const env = process.env
const Team = mongoose.model(env.TEAM_MODEL);

const addOne = function (request, response) {
    console.log("addOne controller");

    const newTeam = {};

    if (request.body && Object.keys(request.body).length != 0) {
        if (request.body.country !== null) {
            newTeam.country = request.body.country;
        }
        if (request.body.yearEstablished !== null) {
            newTeam.yearEstablished = request.body.yearEstablished;
        }
        if (request.body.totalWorldCupWon !== null) {
            newTeam.totalWorldCupWon = request.body.totalWorldCupWon;
        }
        if (request.body.players !== null && request.body.players != undefined) {
            newTeam.players = request.body.players.map(player => ({
                name: player.name,
                age: player.age,
                yearJoined: player.yearJoined
            }));
        }
    }
    else {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.MISSING_REQUEST_BODY);
    }
    Team.create(newTeam)
        .then(team => responseHelper.sendSuccess(response, team))
        .catch(error => responseHelper.handleError(response, error))
}

const getAll = function (request, response) {
    console.log("getAll controller");
    let offset = 0;
    let count = 5;
    const decimalBase = 10;

    if (request.query) {
        if (request.query.offset) {
            if (isNaN(request.query.offset)) {
                return responseHelper.sendError(response, env.BAD_REQUEST, env.PROVIDE_VALID_OFFSET);
            }
            offset = parseInt(request.query.offset, decimalBase);
            if (offset < 0) {
                return responseHelper.sendError(response, env.BAD_REQUEST, env.OFFSET_MUST_BE_NON_NEGATIVE);
            }
        }
        if (request.query.count) {
            if (isNaN(request.query.count)) {
                return responseHelper.sendError(response, env.BAD_REQUEST, env.PROVIDE_VALID_COUNT);
            }
            count = parseInt(request.query.count, decimalBase);
            if (count <= 0) {
                return responseHelper.sendError(response, env.BAD_REQUEST, env.COUNT_SHOULD_BE_GREATER_THAN_0);
            }
            else if (count > 5) {
                return responseHelper.sendError(response, env.BAD_REQUEST, env.COUNT_SHOULD_NOT_EXCEED_5);
            }
        }
    }
    Team.find().skip(offset).limit(count)
        .then(teams => responseHelper.sendSuccess(response, teams))
        .catch(error => responseHelper.handleError(response, error))
}

const getOne = function (request, response) {
    console.log("getOne controller");

    const teamId = request.params.Id;

    _validateTeamId(teamId)
        .then(id => { return Team.findById(teamId) })
        .catch(error => responseHelper.sendError(response, env.NOT_FOUND, env.PROVIDE_VALID_TEAM_ID))
        .then(team => _validateTeamLength(team))
        .catch(error => responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND))
        .then(team => responseHelper.sendSuccess(response, team))
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
const deleteOne = function (request, response) {
    console.log("deleteOne controller");
    const teamId = request.params.Id;

    _validateTeamId(teamId)
        .then(id => { return Team.deleteOne({ _id: id }) })
        .catch(error => responseHelper.sendError(response, env.NOT_FOUND, env.PROVIDE_VALID_TEAM_ID))
        .then(team => _validateDeleteCount(team))
        .then(team => responseHelper.sendSuccess(response, { message: env.RECORD_DELETED_SUCCESSFULLY }))
        .catch(error => responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND))
        .catch(error => responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR))
}
const _validateDeleteCount = function (team) {
    return new Promise((resolve, reject) => {
        if (team.deletedCount === 0) {
            reject();
        }
        else resolve(team)
    })
}

const partialUpdate = function (request, response) {
    console.log("partialUpdate teams controller");

    _update(request, response, _updatePartialTeamMapping);
}
const _update = function (request, response, updateTeamMapping) {
    const teamId = request.params.Id;

    _validateTeamId(teamId)
        .then(id => { return Team.findById(id) })
        .catch(error => responseHelper.sendError(response, env.NOT_FOUND, env.PROVIDE_VALID_TEAM_ID))
        .then(team => updateTeamMapping(request, team))
        .then(team => team.save())
        .then(team => responseHelper.sendSuccess(response, { message: env.RECORD_UPDATED_SUCCESSFULLY }))
        .catch(error => {
            console.log(error)
            responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR)
        })
}


const fullUpdate = function (request, response) {
    console.log("fullUpdate teams controller");
    _update(request, response, updateFullTeamMapping);
}



const _updatePartialTeamMapping = function (request, team) {
    return new Promise((resolve, reject) => {
        if (request.body && request.body.country) {
            team.country = request.body.country;
        }
        if (request.body && request.body.yearEstablished) {
            team.yearEstablished = request.body.yearEstablished;
        }
        if (request.body && request.body.totalWorldCupWon) {
            team.totalWorldCupWon = request.body.totalWorldCupWon;
        }
        if (request.body && request.body.players) {
            team.players = request.body.players?.map(player => ({
                name: player.name,
                age: player.age,
                yearJoined: player.yearJoined
            }));
        }
        resolve(team)
    })

}

const updateFullTeamMapping = function (request, team) {
    return new Promise((resolve, reject) => {
        team.country = request.body.country;
        team.yearEstablished = request.body.yearEstablished;
        team.totalWorldCupWon = request.body.totalWorldCupWon;
        team.players = request.body.players?.map(player => ({
            name: player.name,
            age: player.age,
            yearJoined: player.yearJoined
        }));
        resolve(team)
    })
}
module.exports = {
    getAll,
    getOne,
    deleteOne,
    addOne,
    partialUpdate,
    fullUpdate,
}