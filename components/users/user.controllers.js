const mongoose = require("mongoose");
const responseHelper = require("../Utility/responseHelper");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
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
const _validateIfUserExists = function (user) {
    return new Promise((resolve, reject) => {
        if (user) {
            resolve(user);
        }
        else reject();
    })
}

const _validatePasswordMatch = function (passwordMatch) {
    return new Promise((resolve, reject) => {
        if (passwordMatch) resolve()
        else reject()
    })
}

const _generateJWT = function (username) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign(username, "MWA")
        resolve(token)
    })
}
const login = function (req, res) {
    console.log("login User")

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: username })
        .then((databaseUser) => _validateIfUserExists(databaseUser))
        .then((databaseUser) => bcrypt.compare(password, databaseUser.password))
        .then((passwordMatch) => _validatePasswordMatch(passwordMatch))
        .then(_ => _generateJWT(username))
        .then(token => res.status(201).json({ "token": token }))
        .catch(error => {
            res.status(401).json("Unauthorized")
        })
}
const authenticateUser = function (req, res, next) {
    console.log("authenticate user")
    const authHeader = req.headers.authorization
    console.log(authHeader)
    try {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, "MWA")
        next()

    }
    catch (error) {
        console.log("Unauthorized")
        res.status(401).json("Unauthorized")
    }
}

module.exports = {
    createUser,
    login,
    authenticateUser
}