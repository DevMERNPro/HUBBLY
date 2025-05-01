import { Document } from "mongoose";

export interface IBaseUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  confirmPassword?: string; 
}

export const IbaseUserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  confirmPassword: { type: String, required: false },
};
