const sendError = function (response, statusCode, responseMessage) {
    response.status(statusCode).json({ "message": responseMessage });
}


module.exports = {
    sendError
}