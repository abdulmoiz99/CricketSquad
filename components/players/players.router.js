const express = require("express")
const router = express.Router();
const playersController = require("./player.controller")
const env = process.env


router.route(env.TEAM_PLAYERS_URL)
    .get(playersController.getAll)
    .post(playersController.addOne)


router.route(env.TEAM_PLAYER_URL)
    .delete(playersController.deleteOne)
    .patch(playersController.updateOne)

module.exports = router;