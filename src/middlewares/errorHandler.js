import ApiError from "../utils/apiError.js";

export default function errorHandler(err, req, res, next) {
    console.error(err);

    let statusCode = 500;
    let message = "Internal Server Error"
    let code = "INTERNAL_ERROR"

    if (err.name == "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(", ")
        code = "VALIDATION_ERROR";
    }

    else if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
        code = "INVALID_ID";
    }

     else if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
        code = "DUPLICATE_FIELD";
    }

    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
        code = "INVALID_TOKEN";
    }

    else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
        code = "TOKEN_EXPIRED";
    }

    else if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.code;
    }



    res.status(statusCode).json({
        success: false,
        message,
        code
    });
}