import { param, body, query } from "express-validator";
import { RoleEnum as ROLES } from "../types";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone); // Extend dayjs with timezone plugin
// set dayjs to IST timezone
dayjs.tz.setDefault("Asia/Kolkata");

export const idValidater = [
  param("id").isMongoId().withMessage("Id must be a valid mongo id"),
];

export const roleValidater = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
];

export const roleParamsValidater = [
  query("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
];

export const roleWithQParamsValidater = [
  query("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),

  query("q").optional().isString().withMessage("Query must be a string"),
];

export const addSubjectValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
];

export const editSubjectValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
];

export const addUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
  body("assignedSubject")
    .optional()
    .isMongoId()
    .withMessage("Assigned Subject must be a valid mongo id"),

  body("assignedTeacher")
    .optional()
    .isMongoId()
    .withMessage("Assigned Teacher must be a valid mongo id"),
];

export const editUserValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("email").optional().isEmail().withMessage("Email must be a valid email"),
  body("password")
    .optional()
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
  body("assignedSubject")
    .optional()
    .isMongoId()
    .withMessage("Assigned Subject must be a valid mongo id"),

  body("assignedTeacher")
    .optional()
    .isMongoId()
    .withMessage("Assigned Teacher must be a valid mongo id"),
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
];

export const forgotPasswordValidator = [
  body("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 6, max: 10 })
    .withMessage("New Password must be at least 6 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Role must be in " + Object.values(ROLES).join(", ")),
];

export const addSessionValidator = [
  body("studentId")
    .notEmpty()
    .withMessage("Student Id is required")
    .isMongoId()
    .withMessage("Student Id must be a valid mongo id"),
  body("teacherId")
    .notEmpty()
    .withMessage("Teacher Id is required")
    .isMongoId()
    .withMessage("Teacher Id must be a valid mongo id"),
  body("link")
    .notEmpty()
    .withMessage("Link is required")
    .isURL()
    .withMessage("Link must be a valid URL"),
  body("when")
    .notEmpty()
    .withMessage("When is required")
    .isDate()
    .withMessage("When must be a valid date")
    .custom((value) => {
      return dayjs(value).isAfter(dayjs());
    })
    .withMessage("When must be in future"),
];

export const editSessionValidator = [
  body("link").optional().isURL().withMessage("Link must be a valid URL"),
  body("when")
    .optional()
    .isDate()
    .withMessage("When must be a valid date")
    .custom((value) => {
      return dayjs(value).isAfter(dayjs());
    })
    .withMessage("When must be in future"),
];

export const addMaterialValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("file").custom((value, { req }) => {
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new Error("File is required");
    }
    return true;
  }),
  body("studentId")
    .notEmpty()
    .withMessage("Student Id is required")
    .isMongoId()
    .withMessage("Student Id must be a valid mongo id"),
  body("teacherId")
    .notEmpty()
    .withMessage("Teacher Id is required")
    .isMongoId()
    .withMessage("Teacher Id must be a valid mongo id"),
  body("toAll").optional().isBoolean().withMessage("To All must be a boolean"),
];

export const editMaterialValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),
];

export const addFeedbackValidator = [
  body("studentId")
    .notEmpty()
    .withMessage("Student Id is required")
    .isMongoId()
    .withMessage("Student Id must be a valid mongo id"),
  body("teacherId")
    .notEmpty()
    .withMessage("Teacher Id is required")
    .isMongoId()
    .withMessage("Teacher Id must be a valid mongo id"),
  body("sessionId")
    .notEmpty()
    .withMessage("Session Id is required")
    .isMongoId()
    .withMessage("Session Id must be a valid mongo id"),
  body("text")
    .notEmpty()
    .withMessage("Text is required")
    .isString()
    .withMessage("Text must be a string"),
];

export const addAttendenceValidator = [
  body("studentId")
    .notEmpty()
    .withMessage("Student Id is required")
    .isMongoId()
    .withMessage("Student Id must be a valid mongo id"),
  body("subjectId")
    .notEmpty()
    .withMessage("Subject Id is required")
    .isMongoId()
    .withMessage("Subject Id must be a valid mongo id"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["PRESENT", "ABSENT"])
    .withMessage("Status must be in PRESENT, ABSENT"),
  body("when")
    .notEmpty()
    .withMessage("When is required")
    .isDate()
    .withMessage("When must be a valid date"),
];

export const addMarksValidator = [
  body("studentId")
    .notEmpty()
    .withMessage("Student Id is required")
    .isMongoId()
    .withMessage("Student Id must be a valid mongo id"),
  body("subjectId")
    .notEmpty()
    .withMessage("Subject Id is required")
    .isMongoId()
    .withMessage("Subject Id must be a valid mongo id"),
  body("marks")
    .notEmpty()
    .withMessage("Marks is required")
    .isNumeric()
    .withMessage("Marks must be a number"),
  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isString()
    .withMessage("Year must be a string"),
  body("semester")
    .notEmpty()
    .withMessage("Semester is required")
    .isString()
    .withMessage("Semester must be a string"),
];
