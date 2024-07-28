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

    TeamCreateCallback(newTeam, function (error, team) {
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

    if (request.query) {
        if (request.query.offset) {
            if (isNaN(request.query.offset)) {
                return responseHelper.sendError(400, process.env.PROVIDE_VALID_OFFSET);
            }
            offset = parseInt(request.query.offset, 10);
            if (offset < 0) {
                return responseHelper.sendError(400, process.env.OFFSET_MUST_BE_NON_NEGATIVE);
            }
        }
        if (request.query.count) {
            if (isNaN(request.query.count)) {
                return responseHelper.sendError(400, process.env.PROVIDE_VALID_COUNT);
            }
            count = parseInt(request.query.count, 10);
            if (count <= 0 || count > 5) {
                return responseHelper.sendError(400, process.env.COUNT_MUST_BE_POSITIVE_AND_WITHIN_LIMIT);
            }
        }
    }
    TeamFindSkipLimitExecCallback(offset, count, function (error, teams) {
        if (error) {
            return responseHelper.sendError(response, 500, process.env.INTERNAL_SERVER_ERROR);
        }
        else if (!teams || teams.length === 0) {
            return responseHelper.sendError(response, 404, process.env.NO_RECORD_FOUND);
        }
        return response.status(200).json(teams);
    });
}
const getOne = function (request, response) {
    console.log("getOne controller");

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
    console.log("deleteOne controller");
    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, 400, process.env.PROVIDE_VALID_TEAM_ID);
    }

    TeamDeleteOneExecCallback(teamId, function (error, teams) {
        if (error) {
            return responseHelper.sendError(response, 500, process.env.INTERNAL_SERVER_ERROR);
        }
        if (teams.deletedCount === 0) {
            return responseHelper.sendError(response, 404, process.env.NO_RECORD_FOUND);
        }
        else response.status(200).json({ message: process.env.RECORD_DELETED_SUCCESSFULLY });
    });
}


const updateOne = function (request, response) {
    console.log("updateOne teams controller");

    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, 400, process.env.PROVIDE_VALID_TEAM_ID);
    }
    const newTeam = {
        country: request.body.country,
        yearEstablished: request.body.yearEstablished,
        totalWorldCupWon: request.body.totalWorldCupWon,
    };
    TeamUpdateOneExecCallback(teamId, newTeam, function (error, teams) {
        if (error) {
            return responseHelper.sendError(response, 500, process.env.INTERNAL_SERVER_ERROR);
        }
        else if (!teams || teams.length === 0) {
            return responseHelper.sendError(response, 404, process.env.NO_RECORD_FOUND);
        }
        return response.status(200).json(teams);
    })
}



module.exports = {
    getAll,
    getOne,
    deleteOne,
    addOne,
    updateOne,
}