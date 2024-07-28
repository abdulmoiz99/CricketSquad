const mongoose = require("mongoose");
const responseHelper = require("../responseHelper");

const env = process.env
const Team = mongoose.model(env.TEAM_MODEL);

const getAll = function (request, response) {
    console.log("players getAll")

    const teamId = request.params.Id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, 400, process.env.PROVIDE_VALID_TEAM_ID);
    }

    Team.findById(teamId, { 'players': 1 }).exec(function (error, teams) {

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
    const teamId = request.params.Id;
    const playerId = "66a59b4f4ac250bb43a9d6da";

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return responseHelper.sendError(response, 400, process.env.PROVIDE_VALID_TEAM_ID);
    }

    Team.findOneAndUpdate(
        { "_id": mongoose.Types.ObjectId("66a59b4f4ac250bb43a9d6d7") },
        { "$pull": { "players": { "_id": mongoose.Types.ObjectId("66a59b4f4ac250bb43a9d6d9") } } }
    ).exec(function (error, teams) {
        if (error) {
            return responseHelper.sendError(response, 500, process.env.INTERNAL_SERVER_ERROR);
        }
        return response.status(200).json(teams)
    });
}

module.exports = {
    getAll,
    deleteOne,
}