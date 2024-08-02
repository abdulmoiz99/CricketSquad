const env = process.env

const sendError = function (response, statusCode, responseMessage) {
    const decimalBase = 10;
    const intStatusCode = parseInt(statusCode, decimalBase);
    response.status(intStatusCode).json({ "message": responseMessage });
}
const sendSuccess = function (response, responseMessage) {
    const decimalBase = 10;
    const intStatusCode = parseInt(env.SUCCESS, decimalBase);
    return response.status(intStatusCode).json(responseMessage);
}
const handleError = function (response, error) {
    if (error && error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
        });
        return sendError(response, env.BAD_REQUEST, errors)
    }
    else {
        return sendError(response, env.INTERNAL_SERVER, env.INTERNAL_SERVER_ERROR)
    }

}
module.exports = {
    sendError,
    sendSuccess,
    handleError,
}