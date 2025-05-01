import { Schema, model } from "mongoose";
import { IBaseUser, IbaseUserSchema } from "./base.model";

export interface IAdmin extends IBaseUser {}

const adminSchema = new Schema(IbaseUserSchema, {lastname:String, timestamps: true });

export const Admin = model<IAdmin>("admin", adminSchema);

