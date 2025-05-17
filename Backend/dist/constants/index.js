"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOLDER_PATH = exports.redLogger = exports.yellowText = exports.redText = exports.blueText = exports.greenText = void 0;
exports.greenText = "\x1b[32m";
exports.blueText = "\x1b[34m";
exports.redText = "\x1b[31m";
exports.yellowText = "\x1b[33m";
const redLogger = (obj) => {
    console.log(exports.redText, obj, exports.redText);
};
exports.redLogger = redLogger;
exports.FOLDER_PATH = {
    PUBLIC: "public",
    UPLOADS: "uploads",
};
