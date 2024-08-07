const mongoose = require("mongoose");
const responseHelper = require("../Utility/responseHelper");
const callbackify = require("util").callbackify

const env = process.env
const Team = mongoose.model(env.TEAM_MODEL);

const TeamFindSkipLimitExecCallback = callbackify(function (offset, count) {
    return Team.find().skip(offset).limit(count).exec();
})

const TeamFindByIdExecCallback = callbackify(function (teamId) {
    return Team.findById(teamId).exec();
})

const TeamDeleteOneExecCallback = callbackify(function (teamId) {
    return Team.deleteOne({ _id: teamId }).exec();
})

const TeamSaveCallBack = callbackify(function (team) {
    return team.save();
})

const TeamCreateCallback = callbackify(function (newTeam) {
    return Team.create(newTeam);
})

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
    TeamCreateCallback(newTeam, function (error, team) {
        if (error) {
            return responseHelper.handleError(response, error);
        } else {
            return responseHelper.sendSuccess(response, team)
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
    TeamFindSkipLimitExecCallback(offset, count, function (error, teams) {
        if (error) {
            return responseHelper.handleError(response.error);
        }
        else if (!teams || teams.length === 0) {
            return responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND);
        }
        return responseHelper.sendSuccess(response, teams);
    });
}

const getOne = function (request, response) {
    console.log("getOne controller");

    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.PROVIDE_VALID_TEAM_ID);
    }

    TeamFindByIdExecCallback(teamId, function (error, teams) {
        if (error) {
            return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);
        }
        else if (!teams || teams.length === 0) {
            return responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND);
        }
        return responseHelper.sendSuccess(response, teams);
    });
}

const deleteOne = function (request, response) {
    console.log("deleteOne controller");
    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.PROVIDE_VALID_TEAM_ID);
    }

    TeamDeleteOneExecCallback(teamId, function (error, teams) {
        if (error) {
            return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);
        }
        if (teams.deletedCount === 0) {
            return responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND);
        }
        else responseHelper.sendSuccess(response, { message: env.RECORD_DELETED_SUCCESSFULLY });
    });
}
const _update = function (request, response, updateTeamMapping) {
    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.PROVIDE_VALID_TEAM_ID);
    }
    TeamFindByIdExecCallback(teamId, function (error, team) {
        if (!team) {
            return responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND);
        }
        else {
            updateTeamMapping(request, team);
            TeamSaveCallBack(team, function (error, updatedTeam) {
                if (error) {
                    return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);
                }
                else {
                    console.log(updatedTeam);
                    return responseHelper.sendSuccess(response, { message: env.RECORD_UPDATED_SUCCESSFULLY });
                }
            });

        }
    })
}

const partialUpdate = function (request, response) {
    console.log("partialUpdate teams controller");

    _update(request, response, updatePartialTeamMapping);
}


const fullUpdate = function (request, response) {
    console.log("fullUpdate teams controller");

    _update(request, response, updateFullTeamMapping);
}

module.exports = {
    getAll,
    getOne,
    deleteOne,
    addOne,
    partialUpdate,
    fullUpdate,
}

const updatePartialTeamMapping = function (request, team) {
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
}

const updateFullTeamMapping = function (team, request) {
    team.country = request.body.country;
    team.yearEstablished = request.body.yearEstablished;
    team.totalWorldCupWon = request.body.totalWorldCupWon;
    team.players = request.body.players?.map(player => ({
        name: player.name,
        age: player.age,
        yearJoined: player.yearJoined
    }));
}
