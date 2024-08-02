const express = require("express")
const router = express.Router();
const usersControllers = require("./user.controllers")

router.route("/users")
    .post(usersControllers.createUser)

module.exports = router;