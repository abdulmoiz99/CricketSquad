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


router.route("/teams/:Id/players")
    .get(playersController.getAll)
    .delete(playersController.deleteOne)

module.exports = router;