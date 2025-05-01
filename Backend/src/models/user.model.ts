import { Schema, model } from "mongoose";
import { IBaseUser, IbaseUserSchema } from "./base.model";

export interface IUser extends IBaseUser {}

const userSchema = new Schema(IbaseUserSchema, {lastname:String, timestamps: true });

export const User = model<IUser>("users", userSchema);
