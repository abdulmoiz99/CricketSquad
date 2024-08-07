const express = require("express")
const router = express.Router();
const playersController = require("./player.controller")

router.route("/teams/:Id/players")
    .get(playersController.getAll)
    .post(playersController.addOne)


router.route("/teams/:teamId/players/:playerId")
    .delete(playersController.deleteOne)
    .patch(playersController.updateOne)

module.exports = router;