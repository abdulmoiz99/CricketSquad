const express = require("express")
const router = express.Router();
const playersRouter = require("../players/players.router")
const teamsRouter = require("../teams/teams.router")
const userRouter = require("../users/user.router")

router.use("/", teamsRouter);

router.use("/", playersRouter);

router.use("/", userRouter);

module.exports = router;