import jwt from "jsonwebtoken";
import config from "../config";
import multer from "multer";
import { v4 as uuid } from "uuid";
import nodemailer from "nodemailer";
import { Request } from "express";
import { IBaseUser, IUser, IEmployee, Admin, ITicket ,Employee,User} from "../models/index";

import { Role, RoleEnum, TokenInfo } from "../types";
import { stat, unlink, readFile } from "fs/promises";
import { FOLDER_PATH } from "../constants";
import path from "path";
import { Model } from "mongoose";


export const generateJwtToken = (user: IBaseUser | TokenInfo, role: Role) => {
  const dataToAdd = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role,
  } as TokenInfo;

  const token = jwt.sign(dataToAdd, config.JWT_SECRET, {
    issuer: config.JWT_ISSUER,
  });

  return token;
};

export const uploadLocal = multer({
  storage: multer.diskStorage({
    destination: (_: Request, __: Express.Multer.File, cb: Function) => {
      cb(
        null,
        path.join(process.cwd(), FOLDER_PATH.PUBLIC, FOLDER_PATH.UPLOADS)
      );
    },
    filename: (_: Request, file: Express.Multer.File, cb: Function) => {
      const fileType = file.originalname.split(".")[1];
      cb(null, `${uuid()}.${fileType}`);
    },
  }),
});

export const uploadFile = async (file?: Express.Multer.File) => {
  if (!file) return "";
  return `${config.HOST}/static/${FOLDER_PATH.UPLOADS}/${file.filename}`;
};

export const removeFile = async (file?: Express.Multer.File) => {
  try {
    if (!file) return;
    const fileStat = await stat(file.path);
    if (fileStat.isFile()) {
      await unlink(file.path);
      console.log(`File on path ${file.path} deleted successfully`);
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @param url - the url to remove
 * @returns true if the file is removed successfully or else false if not removed
 */
export const removeFileInURL = async (url?: string) => {
  try {
    if (!url) return false;

    const fileName = url.split("/").pop();

    if (!fileName) return false;

    const filePath = path.join(
      process.cwd(),
      FOLDER_PATH.PUBLIC,
      FOLDER_PATH.UPLOADS,
      fileName
    );

    const fileStat = await stat(filePath);

    if (fileStat.isFile()) {
      unlink(filePath);
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * @description - nodemailer transporter
 * @returns - nothing
 * instance of nodemailer transporter
 */
const transpoter = nodemailer.createTransport(config.SMTP_URL, {});

export const sendMail = async (
  to: string,
  subject: string,
  templateName: string,
  variables: Record<string, string>
) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "mail-templates",
      templateName
    );

    let template = await readFile(templatePath, "utf-8");

    if (!template) {
      console.error("template not found");
      return;
    }

    const keys = Object.keys(variables);

    keys.forEach((key) => {
      template = template.replace(
        new RegExp(`{{${key}}}`, "g"),
        variables[key]
      );
    });

    await transpoter.sendMail({
      from: config.SMTP_FROM,
      to,
      subject,
      html: template,
    });
  } catch (error) {
    console.error(error, "failed to send mail");
  }
};

export const getUserByRole = async (
  role: Role,
  query?: Record<string, string | number | {}>
) => {
  try {
    let user;

    switch (role) {
      case RoleEnum.ADMIN:
        user = await Admin.findOne(query);
        break;
      case RoleEnum.EMPLOYEE:
        user = await Employee.findOne(query);
        break;
      case RoleEnum.USER:
        user = await User.findOne(query);
        break;
      default:
        user = null;
        break;
    }

    return user;
  } catch (error) {
    return null;
  }
};

export const getModelByRole = (role: Role) => {
  try {
    let modelToUse: typeof Model | null = null;

    switch (role) {
      case RoleEnum.ADMIN:
        modelToUse = Admin;
        break;
      case RoleEnum.EMPLOYEE:
        modelToUse = Employee;
        break;
      case RoleEnum.USER:
        modelToUse = User;
      default:
        break;
    }

    return modelToUse;
  } catch (error) {
    return null;
  }
};
