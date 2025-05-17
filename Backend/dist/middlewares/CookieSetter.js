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
exports.CookieSetter = void 0;
const config_1 = __importDefault(require("../config"));
const lib_1 = require("../constants/lib");
/**
 * @description Set the token in the cookie of the browser
 *
 */
const CookieSetter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, lib_1.generateJwtToken)(req.user, req.user.role);
    // set developer signature in the token MT
    //set the token in the cookie
    res.cookie("token", token, config_1.default.COOKIE_SETTINGS);
    next();
});
exports.CookieSetter = CookieSetter;
