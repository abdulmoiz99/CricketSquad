const express = require("express")
const router = express.Router();
const teamsController = require("./controllers/teams")


router.route("/teams")
    .get(function (request, response) {
        teamsController.getAll(request, response)
    })

module.exports = router;