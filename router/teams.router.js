const express = require("express")
const router = express.Router();
const teamsController = require("../controllers/teams")

router.route("/teams")
    .get(teamsController.getAll)
    .post(teamsController.addOne)

router.route("/teams/:Id")
    .get(teamsController.getOne)
    .delete(teamsController.deleteOne)
    .patch(teamsController.partialUpdate)
    .put(teamsController.fullUpdate)

module.exports = router;