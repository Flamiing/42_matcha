export function returnErrorWithNext(res, next, statusCode, errorMessage) {
    if (!res.responseData) res.status(statusCode).json({ msg: errorMessage });
    return next(new Error(errorMessage));
}
