const mongoose = require("mongoose");
const responseHelper = require("../Utility/responseHelper");
const bcrypt = require("bcryptjs")
const _env = process.env
const User = mongoose.model(_env.USER_MODEL);

const createUser = function (request, response) {
    console.log("addOne user controller");

    const newUser = {
        name: request.body.name,
        username: request.body.username,
        password: request.body.password,
    };

    bcrypt.genSalt(parseInt(_env.SALT_ROUND))
        .then(salt => bcrypt.hashSync(newUser.password, salt))
        .then(hash => newUser.password = hash)
        .then(_ => User.create(newUser))
        .then(user => responseHelper.sendSuccess(response, user))
        .catch(error => responseHelper.sendError(response, _env.INTERNAL_SERVER, error))
}

module.exports = {
    createUser
}