"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const constants_1 = require("../constants");
/**
 * This is the error handler it will catch all the errors in the application
 * and sends it as a response along with appropriate error code
 */
exports.default = (err, req, res, next) => {
    if (!config_1.default.PRODUCTION) {
        console.log(constants_1.redText, err.message, constants_1.redText);
    }
    switch (err.code) {
        case "ER_DUP_ENTRY":
            (0, constants_1.redLogger)(err.driverError.sqlMessage);
            //err.driverError.sqlMessage= error is  Duplicate entry '8179293774'
            res.status(400).json({
                msg: err.driverError.sqlMessage.split("'")[1] +
                    " already exists" +
                    " with " +
                    err.driverError.sqlMessage.split("'")[3],
            });
            // res.status(400).json({ message: "Cannot add duplicate entry" });
            break;
        case 400:
            res.status(400).json({ msg: err.message });
            break;
        case 401:
            res.status(401).json({ msg: err.message });
            break;
        case 403:
            res.status(403).json({ msg: err.message });
            break;
        case 404:
            res.status(404).json({ msg: err.message });
            break;
        default:
            res.status(500).json({
                msg: err.message ||
                    "Something went wrong , please try again after some time",
            });
            break;
    }
};
