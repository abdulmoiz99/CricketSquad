const mongoose = require("mongoose");
const responseHelper = require("../responseHelper");
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

const TeamUpdateOneExecCallback = callbackify(function (teamId, newTeam) {
    const filter = { _id: teamId };
    const update = {};

    if (newTeam.country !== null) {
        update.country = newTeam.country;
    }
    if (newTeam.yearEstablished !== null) {
        update.yearEstablished = newTeam.yearEstablished;
    }
    if (newTeam.totalWorldCupWon !== null) {
        update.totalWorldCupWon = newTeam.totalWorldCupWon;
    }

    return Team.findOneAndUpdate(filter, update);
})
const TeamCreateCallback = callbackify(function (newTeam) {
    return Team.create(newTeam);
})
const TeamReplaceOneCallback = callbackify(function (teamId, updatedTeam) {
    return Team.replaceOne({ _id: teamId }, updatedTeam)
})

const addOne = function (request, response) {
    console.log("addOne controller");

    const newTeam = {
        country: request.body.country,
        yearEstablished: request.body.yearEstablished,
        totalWorldCupWon: request.body.totalWorldCupWon,
        players: request.body.players.map(player => ({
            name: player.name,
            age: player.age,
            yearJoined: player.yearJoined
        }))
    };

    TeamCreateCallback(newTeam, function (error, team) {
        if (error) {
            console.log(error);
            return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);
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
            return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);
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

const updateOne = function (request, response) {
    console.log("updateOne teams controller");

    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.PROVIDE_VALID_TEAM_ID);
    }
    const updatedTeam = {};
    if (request.body && Object.keys(request.body).length != 0) {
        if (request.body.country !== null) {
            updatedTeam.country = request.body.country;
        }
        if (request.body.yearEstablished !== null) {
            updatedTeam.yearEstablished = request.body.yearEstablished;
        }
        if (request.body.totalWorldCupWon !== null) {
            updatedTeam.totalWorldCupWon = request.body.totalWorldCupWon;
        }
    }
    else {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.MISSING_REQUEST_BODY);
    }
    TeamUpdateOneExecCallback(teamId, updatedTeam, function (error, teams) {
        if (error) {
            return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);
        }
        else if (!teams || teams.length === 0) {
            return responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND);
        }
        return responseHelper.sendSuccess(response, { message: env.RECORD_UPDATED_SUCCESSFULLY });
    })
}

const updateFull = function (request, response) {
    console.log("updateFull teams controller");

    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.PROVIDE_VALID_TEAM_ID);
    }
    const updatedTeam = {};

    if (request.body && Object.keys(request.body).length != 0) {
        if (request.body.country !== null) {
            updatedTeam.country = request.body.country;
        }
        if (request.body.yearEstablished !== null) {
            updatedTeam.yearEstablished = request.body.yearEstablished;
        }
        if (request.body.totalWorldCupWon !== null) {
            updatedTeam.totalWorldCupWon = request.body.totalWorldCupWon;
        }
        if (request.body.players !== null || request.body.players == undefined) {
            updatedTeam.players = request.body.players.map(player => ({
                name: player.name,
                age: player.age,
                yearJoined: player.yearJoined
            }));
        }
    }
    else {
        return responseHelper.sendError(response, env.BAD_REQUEST, env.MISSING_REQUEST_BODY);
    }

    TeamReplaceOneCallback(teamId, updatedTeam, function (error, teams) {
        if (error) {
            return responseHelper.sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR);
        }
        else if (!teams || teams.modifiedCount === 0) {
            return responseHelper.sendError(response, env.NOT_FOUND, env.NO_RECORD_FOUND);
        }
        return responseHelper.sendSuccess(response, { message: env.RECORD_UPDATED_SUCCESSFULLY });
    })
}

module.exports = {
    getAll,
    getOne,
    deleteOne,
    addOne,
    updateOne,
    updateFull,
}