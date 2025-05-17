"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forbidden = exports.NotFound = exports.Unauthorized = exports.BadRequest = exports._404 = exports._402 = exports._401 = exports._400 = void 0;
exports._400 = 400;
exports._401 = 401;
exports._402 = 402;
exports._404 = 404;
class BadRequest extends Error {
    constructor(message) {
        super(message);
        this.code = 400;
        this.name = "BadRequest";
    }
}
exports.BadRequest = BadRequest;
class Unauthorized extends Error {
    constructor(message) {
        super(message);
        this.code = 401;
        this.name = "Unauthorized";
    }
}
exports.Unauthorized = Unauthorized;
class NotFound extends Error {
    constructor(message) {
        super(message);
        this.code = 404;
        this.name = "NotFound";
    }
}
exports.NotFound = NotFound;
class Forbidden extends Error {
    constructor(message) {
        super(message);
        this.code = 403;
        this.message = "Forbidden";
    }
}
exports.Forbidden = Forbidden;
