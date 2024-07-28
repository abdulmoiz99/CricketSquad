const sendError = function (response, statusCode, responseMessage) {
    const decimalBase = 10;
    const intStatusCode = parseInt(statusCode, decimalBase);
    response.status(intStatusCode).json({ "message": responseMessage });
}
const sendSuccess = function (response, responseMessage) {
    const decimalBase = 10;
    const intStatusCode = parseInt(process.env.SUCCESS, decimalBase);
    return response.status(intStatusCode).json(responseMessage);
}

module.exports = {
    sendError,
    sendSuccess,
}