import { Document,Schema } from "mongoose";
import mongoose from "mongoose";



interface IChat extends Document {
    titckid: Schema.Types.ObjectId;
    adminid: Schema.Types.ObjectId;
    userid: Schema.Types.ObjectId;
    employeeid: Schema.Types.ObjectId;
    text: string;
    document: string;
    createdAt: Date;
    updatedAt: Date;
    };



const IChatSchema = new Schema({
    ticketId: { type: Schema.Types.ObjectId, ref: "ticket" },
    adminId: { type: Schema.Types.ObjectId, ref: "admin" },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    employeeId: { type: Schema.Types.ObjectId, ref: "employee" },
    text: { type: String, required: true },
    document: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });


export const Chat = mongoose.model<IChat>("chat", IChatSchema);

