import { Schema, model } from "mongoose";
import { IBaseUser, IbaseUserSchema } from "./base.model";

export interface IEmployee extends IBaseUser {}

const employeeSchema = new Schema({
    ...IbaseUserSchema,  // Spread the base fields
    admin: {             // Add admin field correctly
      type: Schema.Types.ObjectId,
      ref: "admin",
      required: true
    }
  }, { timestamps: true });  // Options as second parameter

export const Employee = model<IEmployee>("employee", employeeSchema);
