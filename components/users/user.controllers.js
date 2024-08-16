const mongoose = require("mongoose");
const responseHelper = require("../Utility/responseHelper");
const responseHandler = require("../Utility/responseHandler");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const _env = process.env
const User = mongoose.model(_env.USER_MODEL);
const env = process.env

let _responseObj = {}

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
        .then(user => _responseObj = responseHandler.getSuccessResponseWithMessage("User registered Successfully", {}))
        .catch(error => _responseObj = responseHandler.getCustomResponse(409, "Username already exist.", false))
        .finally(_ => _sendResponse(response, _responseObj))
}

const _sendResponse = function (response, responseObj) {
    return response.status(_responseObj.statusCode).json(_responseObj.result)
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
        const errorResponse = {
            message: env.USER_NOT_AUTHORIZED
        }
        _responseObj = responseHandler.getErrorResponse(errorResponse)
        res.status(_responseObj.statusCode).json(_responseObj.result)
    }
}

module.exports = {
    createUser,
    login,
    authenticateUser
}