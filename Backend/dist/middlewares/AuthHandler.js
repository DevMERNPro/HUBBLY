"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberAuthHandler = void 0;
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CookieSetter_1 = require("./CookieSetter");
const customErrors_1 = require("../customErrors");
const types_1 = require("../types");
const models_1 = require("../models");
const parent_model_1 = require("../models/parent.model");
const TO_IGNORE_URLS = ["/api/users/login"];
/**
 * @description Middleware to check if the user is authenticated or not by checking the token from the cookie
 * and setting the user in the req object for further use and checking if the user is active or not
 * and setting the user in the req object for further use and setting the token in the cookie
 */
const memberAuthHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // skip auth for login
    if (TO_IGNORE_URLS.includes(req.url)) {
        return next();
    }
    const token = req.cookies["token"];
    if (!token) {
        return res.status(customErrors_1._401).json({
            message: "No Token found",
        });
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        if (!user) {
            return res.status(customErrors_1._401).json({
                message: "Invalid token",
            });
        }
        let modelToUse = null;
        switch (user.role) {
            case types_1.RoleEnum.ADMIN:
                modelToUse = models_1.Admin;
                break;
            case types_1.RoleEnum.TEACHER:
                modelToUse = models_1.Teacher;
                break;
            case types_1.RoleEnum.STUDENT:
                modelToUse = models_1.Student;
                break;
            case types_1.RoleEnum.PARENT:
                modelToUse = parent_model_1.Parent;
                break;
            default:
                modelToUse = null;
                break;
        }
        if (!modelToUse) {
            throw new customErrors_1.Unauthorized("Invalid role");
        }
        const result = yield modelToUse.findById(user._id);
        if (!result) {
            throw new customErrors_1.Unauthorized("TokenExpiredError");
        }
        req.user = user;
        yield (0, CookieSetter_1.CookieSetter)(req, res, () => { });
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res
                .status(customErrors_1._401)
                .json({ message: "please login again session expired" });
        }
        else if (error.name === "JsonWebTokenError") {
            return res.status(customErrors_1._401).send({ message: "token maniplation detected" });
        }
        else {
            return res.status(customErrors_1._401).send(error);
        }
    }
});
exports.memberAuthHandler = memberAuthHandler;
