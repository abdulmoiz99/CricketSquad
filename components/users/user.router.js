const express = require("express")
const router = express.Router();
const usersControllers = require("./user.controllers")

router.route(process.env.USERS_URL)
    .post(usersControllers.createUser)

router.route(process.env.USERS_LOGIN_URL)
    .post(usersControllers.login)

module.exports = router;