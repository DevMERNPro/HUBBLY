"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMarksValidator = exports.addAttendenceValidator = exports.addFeedbackValidator = exports.editMaterialValidator = exports.addMaterialValidator = exports.editSessionValidator = exports.addSessionValidator = exports.forgotPasswordValidator = exports.loginValidator = exports.editUserValidator = exports.addUserValidator = exports.editSubjectValidator = exports.addSubjectValidator = exports.roleWithQParamsValidater = exports.roleParamsValidater = exports.roleValidater = exports.idValidater = void 0;
const express_validator_1 = require("express-validator");
const types_1 = require("../types");
const dayjs_1 = __importDefault(require("dayjs"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(timezone_1.default); // Extend dayjs with timezone plugin
// set dayjs to IST timezone
dayjs_1.default.tz.setDefault("Asia/Kolkata");
exports.idValidater = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id must be a valid mongo id"),
];
exports.roleValidater = [
    (0, express_validator_1.body)("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(Object.values(types_1.RoleEnum))
        .withMessage("Role must be in " + Object.values(types_1.RoleEnum).join(", ")),
];
exports.roleParamsValidater = [
    (0, express_validator_1.query)("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(Object.values(types_1.RoleEnum))
        .withMessage("Role must be in " + Object.values(types_1.RoleEnum).join(", ")),
];
exports.roleWithQParamsValidater = [
    (0, express_validator_1.query)("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(Object.values(types_1.RoleEnum))
        .withMessage("Role must be in " + Object.values(types_1.RoleEnum).join(", ")),
    (0, express_validator_1.query)("q").optional().isString().withMessage("Query must be a string"),
];
exports.addSubjectValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
];
exports.editSubjectValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
];
exports.addUserValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be a valid email"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6, max: 10 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(Object.values(types_1.RoleEnum))
        .withMessage("Role must be in " + Object.values(types_1.RoleEnum).join(", ")),
    (0, express_validator_1.body)("assignedSubject")
        .optional()
        .isMongoId()
        .withMessage("Assigned Subject must be a valid mongo id"),
    (0, express_validator_1.body)("assignedTeacher")
        .optional()
        .isMongoId()
        .withMessage("Assigned Teacher must be a valid mongo id"),
];
exports.editUserValidator = [
    (0, express_validator_1.body)("name").optional().isString().withMessage("Name must be a string"),
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Email must be a valid email"),
    (0, express_validator_1.body)("password")
        .optional()
        .isLength({ min: 6, max: 10 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(Object.values(types_1.RoleEnum))
        .withMessage("Role must be in " + Object.values(types_1.RoleEnum).join(", ")),
    (0, express_validator_1.body)("assignedSubject")
        .optional()
        .isMongoId()
        .withMessage("Assigned Subject must be a valid mongo id"),
    (0, express_validator_1.body)("assignedTeacher")
        .optional()
        .isMongoId()
        .withMessage("Assigned Teacher must be a valid mongo id"),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be a valid email"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6, max: 10 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(Object.values(types_1.RoleEnum))
        .withMessage("Role must be in " + Object.values(types_1.RoleEnum).join(", ")),
];
exports.forgotPasswordValidator = [
    (0, express_validator_1.body)("newPassword")
        .notEmpty()
        .withMessage("New Password is required")
        .isLength({ min: 6, max: 10 })
        .withMessage("New Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(Object.values(types_1.RoleEnum))
        .withMessage("Role must be in " + Object.values(types_1.RoleEnum).join(", ")),
];
exports.addSessionValidator = [
    (0, express_validator_1.body)("studentId")
        .notEmpty()
        .withMessage("Student Id is required")
        .isMongoId()
        .withMessage("Student Id must be a valid mongo id"),
    (0, express_validator_1.body)("teacherId")
        .notEmpty()
        .withMessage("Teacher Id is required")
        .isMongoId()
        .withMessage("Teacher Id must be a valid mongo id"),
    (0, express_validator_1.body)("link")
        .notEmpty()
        .withMessage("Link is required")
        .isURL()
        .withMessage("Link must be a valid URL"),
    (0, express_validator_1.body)("when")
        .notEmpty()
        .withMessage("When is required")
        .isDate()
        .withMessage("When must be a valid date")
        .custom((value) => {
        return (0, dayjs_1.default)(value).isAfter((0, dayjs_1.default)());
    })
        .withMessage("When must be in future"),
];
exports.editSessionValidator = [
    (0, express_validator_1.body)("link").optional().isURL().withMessage("Link must be a valid URL"),
    (0, express_validator_1.body)("when")
        .optional()
        .isDate()
        .withMessage("When must be a valid date")
        .custom((value) => {
        return (0, dayjs_1.default)(value).isAfter((0, dayjs_1.default)());
    })
        .withMessage("When must be in future"),
];
exports.addMaterialValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    (0, express_validator_1.body)("file").custom((value, { req }) => {
        const file = req.file;
        if (!file) {
            throw new Error("File is required");
        }
        return true;
    }),
    (0, express_validator_1.body)("studentId")
        .notEmpty()
        .withMessage("Student Id is required")
        .isMongoId()
        .withMessage("Student Id must be a valid mongo id"),
    (0, express_validator_1.body)("teacherId")
        .notEmpty()
        .withMessage("Teacher Id is required")
        .isMongoId()
        .withMessage("Teacher Id must be a valid mongo id"),
    (0, express_validator_1.body)("toAll").optional().isBoolean().withMessage("To All must be a boolean"),
];
exports.editMaterialValidator = [
    (0, express_validator_1.body)("name").optional().isString().withMessage("Name must be a string"),
];
exports.addFeedbackValidator = [
    (0, express_validator_1.body)("studentId")
        .notEmpty()
        .withMessage("Student Id is required")
        .isMongoId()
        .withMessage("Student Id must be a valid mongo id"),
    (0, express_validator_1.body)("teacherId")
        .notEmpty()
        .withMessage("Teacher Id is required")
        .isMongoId()
        .withMessage("Teacher Id must be a valid mongo id"),
    (0, express_validator_1.body)("sessionId")
        .notEmpty()
        .withMessage("Session Id is required")
        .isMongoId()
        .withMessage("Session Id must be a valid mongo id"),
    (0, express_validator_1.body)("text")
        .notEmpty()
        .withMessage("Text is required")
        .isString()
        .withMessage("Text must be a string"),
];
exports.addAttendenceValidator = [
    (0, express_validator_1.body)("studentId")
        .notEmpty()
        .withMessage("Student Id is required")
        .isMongoId()
        .withMessage("Student Id must be a valid mongo id"),
    (0, express_validator_1.body)("subjectId")
        .notEmpty()
        .withMessage("Subject Id is required")
        .isMongoId()
        .withMessage("Subject Id must be a valid mongo id"),
    (0, express_validator_1.body)("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["PRESENT", "ABSENT"])
        .withMessage("Status must be in PRESENT, ABSENT"),
    (0, express_validator_1.body)("when")
        .notEmpty()
        .withMessage("When is required")
        .isDate()
        .withMessage("When must be a valid date"),
];
exports.addMarksValidator = [
    (0, express_validator_1.body)("studentId")
        .notEmpty()
        .withMessage("Student Id is required")
        .isMongoId()
        .withMessage("Student Id must be a valid mongo id"),
    (0, express_validator_1.body)("subjectId")
        .notEmpty()
        .withMessage("Subject Id is required")
        .isMongoId()
        .withMessage("Subject Id must be a valid mongo id"),
    (0, express_validator_1.body)("marks")
        .notEmpty()
        .withMessage("Marks is required")
        .isNumeric()
        .withMessage("Marks must be a number"),
    (0, express_validator_1.body)("year")
        .notEmpty()
        .withMessage("Year is required")
        .isString()
        .withMessage("Year must be a string"),
    (0, express_validator_1.body)("semester")
        .notEmpty()
        .withMessage("Semester is required")
        .isString()
        .withMessage("Semester must be a string"),
];
