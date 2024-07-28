const express = require("express")
const router = express.Router();
const teamsController = require("./controllers/teams")
const playersController = require("./controllers/players")


router.route("/teams")
    .get(teamsController.getAll)
    .post(teamsController.addOne)

router.route("/teams/:Id")
    .get(teamsController.getOne)
    .delete(teamsController.deleteOne)
    .patch(teamsController.updateOne)
    .put(teamsController.updateFull)


router.route("/teams/:Id/players")
    .get(playersController.getAll)
    .post(playersController.addOne)


router.route("/teams/:teamId/players/:playerId")
    .delete(playersController.deleteOne)
    .patch(playersController.updateOne)

module.exports = router;