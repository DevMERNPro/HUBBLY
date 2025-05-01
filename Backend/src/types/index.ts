import { Schema } from "mongoose";

export type Role = "ADMIN" | "USER" | "EMPLOYEE" ;

export type TokenInfo = {
  _id: Schema.Types.ObjectId;
  email: string;
  name: string;
  role: Role;
};

export enum RoleEnum {
  ADMIN = "ADMIN",
  USER = "USER",
  EMPLOYEE = "EMPLOYEE",
}

export enum SessionStatus {
  PENDING = "PENDING",
  PROGRESS = "PROGRESS",
  COMPLETED = "COMPLETED",
}
