"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = exports.ITicketSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
exports.ITicketSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    employeeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "employee", },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["OPEN", "IN_PROGRESS", "CLOSED"], default: "OPEN" },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "LOW" },
}, { timestamps: true });
exports.Ticket = mongoose_2.default.model("ticket", exports.ITicketSchema);
