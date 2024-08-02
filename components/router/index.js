const express = require("express")
const router = express.Router();
const playersRouter = require("../players/players.router")
const teamsRouter = require("../teams/teams.router")

router.use("/", teamsRouter);

router.use("/", playersRouter);

module.exports = router;