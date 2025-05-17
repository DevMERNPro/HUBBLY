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
exports.getModelByRole = exports.getUserByRole = exports.sendMail = exports.removeFileInURL = exports.removeFile = exports.uploadFile = exports.uploadLocal = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const nodemailer_1 = __importDefault(require("nodemailer"));
const index_1 = require("../models/index");
const types_1 = require("../types");
const promises_1 = require("fs/promises");
const constants_1 = require("../constants");
const path_1 = __importDefault(require("path"));
const generateJwtToken = (user, role) => {
    const dataToAdd = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
    };
    const token = jsonwebtoken_1.default.sign(dataToAdd, config_1.default.JWT_SECRET, {
        issuer: config_1.default.JWT_ISSUER,
    });
    return token;
};
exports.generateJwtToken = generateJwtToken;
exports.uploadLocal = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (_, __, cb) => {
            cb(null, path_1.default.join(process.cwd(), constants_1.FOLDER_PATH.PUBLIC, constants_1.FOLDER_PATH.UPLOADS));
        },
        filename: (_, file, cb) => {
            const fileType = file.originalname.split(".")[1];
            cb(null, `${(0, uuid_1.v4)()}.${fileType}`);
        },
    }),
});
const uploadFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file)
        return "";
    return `${config_1.default.HOST}/static/${constants_1.FOLDER_PATH.UPLOADS}/${file.filename}`;
});
exports.uploadFile = uploadFile;
const removeFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!file)
            return;
        const fileStat = yield (0, promises_1.stat)(file.path);
        if (fileStat.isFile()) {
            yield (0, promises_1.unlink)(file.path);
            console.log(`File on path ${file.path} deleted successfully`);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.removeFile = removeFile;
/**
 *
 * @param url - the url to remove
 * @returns true if the file is removed successfully or else false if not removed
 */
const removeFileInURL = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!url)
            return false;
        const fileName = url.split("/").pop();
        if (!fileName)
            return false;
        const filePath = path_1.default.join(process.cwd(), constants_1.FOLDER_PATH.PUBLIC, constants_1.FOLDER_PATH.UPLOADS, fileName);
        const fileStat = yield (0, promises_1.stat)(filePath);
        if (fileStat.isFile()) {
            (0, promises_1.unlink)(filePath);
        }
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
exports.removeFileInURL = removeFileInURL;
/**
 * @description - nodemailer transporter
 * @returns - nothing
 * instance of nodemailer transporter
 */
const transpoter = nodemailer_1.default.createTransport(config_1.default.SMTP_URL, {});
const sendMail = (to, subject, templateName, variables) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templatePath = path_1.default.join(process.cwd(), "mail-templates", templateName);
        let template = yield (0, promises_1.readFile)(templatePath, "utf-8");
        if (!template) {
            console.error("template not found");
            return;
        }
        const keys = Object.keys(variables);
        keys.forEach((key) => {
            template = template.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
        });
        yield transpoter.sendMail({
            from: config_1.default.SMTP_FROM,
            to,
            subject,
            html: template,
        });
    }
    catch (error) {
        console.error(error, "failed to send mail");
    }
});
exports.sendMail = sendMail;
const getUserByRole = (role, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user;
        switch (role) {
            case types_1.RoleEnum.ADMIN:
                user = yield index_1.Admin.findOne(query);
                break;
            case types_1.RoleEnum.EMPLOYEE:
                user = yield index_1.Employee.findOne(query);
                break;
            case types_1.RoleEnum.USER:
                user = yield index_1.User.findOne(query);
                break;
            default:
                user = null;
                break;
        }
        return user;
    }
    catch (error) {
        return null;
    }
});
exports.getUserByRole = getUserByRole;
const getModelByRole = (role) => {
    try {
        let modelToUse = null;
        switch (role) {
            case types_1.RoleEnum.ADMIN:
                modelToUse = index_1.Admin;
                break;
            case types_1.RoleEnum.EMPLOYEE:
                modelToUse = index_1.Employee;
                break;
            case types_1.RoleEnum.USER:
                modelToUse = index_1.User;
            default:
                break;
        }
        return modelToUse;
    }
    catch (error) {
        return null;
    }
};
exports.getModelByRole = getModelByRole;
