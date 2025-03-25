class BadRequestError extends Error {
    constructor(message, details = []) {
        super(message);
        this.name = "BadRequestError";
        this.statusCode = 400;
        this.details = Array.isArray(details) ? details : [details];
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401;
    }
}

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
        this.statusCode = 403;
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConflictError";
        this.statusCode = 409;
    }
}

class InternalServerError extends Error {
    constructor(message = "Terjadi kesalahan pada server") {
        super(message);
        this.name = "InternalServerError";
        this.statusCode = 500;
    }
}

export {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError
};
