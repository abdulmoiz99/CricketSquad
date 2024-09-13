const express = require("express")
const router = express.Router();
const teamsController = require("./teams.controller")
const authenticationController = require("../users/user.controllers")

router.route(process.env.TEAMS_URL)
    .get(teamsController.getAll)
    .post(teamsController.addOne)

router.route(process.env.TEAM_URL)
    .get(authenticationController.authenticateUser, teamsController.getOne)
    .delete(teamsController.deleteOne)
    .patch(teamsController.partialUpdate)
    .put(teamsController.fullUpdate)

module.exports = router;