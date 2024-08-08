const express = require("express")
const router = express.Router();
const usersControllers = require("./user.controllers")

router.route("/users")
    .post(usersControllers.createUser)

router.route("/users/login")
    .get(usersControllers.authenticateUser)

module.exports = router;