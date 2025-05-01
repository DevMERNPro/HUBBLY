import { Schema,Document } from "mongoose";
import mongoose from "mongoose";


export interface ITicket extends Document {
    userId: Schema.Types.ObjectId;
    employeeId: Schema.Types.ObjectId;
    subject: string;
    description: string;
    status: string;
    priority: string;
    createdAt: Date;
    updatedAt: Date;
    }



export const ITicketSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "employee",  },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["OPEN", "IN_PROGRESS", "CLOSED"], default: "OPEN" },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "LOW" },
  }
,
{timestamps:true},
);
  
  export const Ticket = mongoose.model<ITicket>("ticket", ITicketSchema);