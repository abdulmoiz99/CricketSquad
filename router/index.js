const express = require("express")
const router = express.Router();
const playersRouter = require("./players.router")
const teamsRouter = require("./teams.router")

router.use("/", teamsRouter);

router.use("/", playersRouter);

module.exports = router;