const mongoose = require("mongoose");
const responseHelper = require("../Utility/responseHelper");
const responseHandler = require("../Utility/responseHandler");

const env = process.env
const Team = mongoose.model(env.TEAM_MODEL);


let _responseObj = {}

const addOne = function (request, response) {
    console.log("addOne controller");

    _validateNewTeamRequest(request)
        .then(newTeam => { return Team.create(newTeam) })
        .then(_ => _responseObj = responseHandler.getSuccessResponseWithMessage("Team Created Successfully."))
        .catch(error => _responseObj = responseHandler.getErrorResponse(error))
        .finally(_ => _sendResponse(response, _responseObj))
}
const _validateNewTeamRequest = function (request) {
    const newTeam = {};
    return new Promise((resolve, reject) => {
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
            resolve(newTeam);
        }
        else {
            reject(new Error(env.MISSING_REQUEST_BODY));
        }
    });
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
    const responseData = {
        totalCount: "",
        teams: "",
    }
    Team.find().skip(offset).limit(count)
        .then(teams => {
            responseData.teams = teams;
            return Team.countDocuments();
        })
        .then(teamCount => responseData.totalCount = teamCount)
        .then(_ => _responseObj = responseHandler.getSuccessResponse(responseData))
        .catch(error => _responseObj = responseHandler.getErrorResponse(error))
        .finally(_ => _sendResponse(response, _responseObj))
}
const _sendResponse = function (response, responseObj) {
    return response.status(responseObj.statusCode).json(responseObj.result)
}
const getOne = function (request, response) {
    console.log("getOne controller");
    const teamId = request.params.Id;

    _validateTeamId(teamId)
        .then(id => { return Team.findById(id); })
        .then(team => {
            if (!team) {
                throw new Error(env.NO_RECORD_FOUND);
            }
            return _validateTeamLength(team);
        })
        .then(team => _responseObj = responseHandler.getSuccessResponse(team))
        .catch(error => { _responseObj = responseHandler.getErrorResponse(error) })
        .finally(_ => _sendResponse(response, _responseObj))
}
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
        .then(team => _validateDeleteCount(team))
        .then(_ => _responseObj = responseHandler.getSuccessResponseWithMessage(env.RECORD_DELETED_SUCCESSFULLY))
        .catch(error => _responseObj = responseHandler.getErrorResponse(error))
        .finally(_ => _sendResponse(response, _responseObj))
}
const _validateDeleteCount = function (team) {
    return new Promise((resolve, reject) => {
        if (team.deletedCount === 0) {
            reject(new Error(env.NO_RECORD_FOUND));
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