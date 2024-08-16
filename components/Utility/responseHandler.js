const env = process.env
let genericResponse = {
    statusCode: 200,
    result: {
        success: false,
        message: "",
        data: {}
    }
}
let errorResponse = {
    statusCode: 500,
    message: ""
}
const _getErrorDetails = function (errorMessage) {
    switch (errorMessage) {
        case env.NO_RECORD_FOUND:
            return errorResponse = { statusCode: env.NOT_FOUND, message: env.NO_RECORD_FOUND }
        case env.TEAM_NOT_FOUND:
            return errorResponse = { statusCode: env.TEAM_NOT_FOUND, message: env.NO_RECORD_FOUND }
        case env.PROVIDE_VALID_TEAM_ID:
            return errorResponse = { statusCode: env.BAD_REQUEST, message: env.PROVIDE_VALID_TEAM_ID }
        case env.USER_NOT_AUTHORIZED:
            return errorResponse = { statusCode: env.UNAUTHORIZED, message: env.USER_NOT_AUTHORIZED }
        case env.MISSING_REQUEST_BODY:
            return errorResponse = { statusCode: env.BAD_REQUEST, message: env.MISSING_REQUEST_BODY }
        default:
            console.log(errorMessage)
            return errorResponse = { statusCode: env.INTERNAL_SERVER, message: env.INTERNAL_SERVER_ERROR }
    }
}
const getSuccessResponse = function (responseData) {
    genericResponse = {
        statusCode: 200,
        result: {
            success: true,
            message: "",
            data: responseData
        }
    }
    return genericResponse
}

const getSuccessResponseWithMessage = function (message, responseData) {
    genericResponse = {
        statusCode: 200,
        result: {
            success: true,
            message: message,
            data: responseData
        }
    }
    return genericResponse
}
const getCustomResponse = function (statusCode, message, success) {
    genericResponse = {
        statusCode: statusCode,
        result: {
            success: success,
            message: message,
        }
    }
    return genericResponse
}
const getErrorResponse = function (error) {
    errorResponse = _getErrorDetails(error.message);
    const decimalBase = 10;
    const intStatusCode = parseInt(errorResponse.statusCode, decimalBase);
    genericResponse = {
        statusCode: intStatusCode,
        result: {
            success: false,
            message: errorResponse.message,
            data: {}
        }
    }
    return genericResponse
}
module.exports = {
    getSuccessResponse,
    getErrorResponse,
    getSuccessResponseWithMessage,
    getCustomResponse,
}