"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
;
const IChatSchema = new mongoose_1.Schema({
    ticketId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ticket" },
    adminId: { type: mongoose_1.Schema.Types.ObjectId, ref: "admin" },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "user" },
    employeeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "employee" },
    text: { type: String, required: true },
    document: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.Chat = mongoose_2.default.model("chat", IChatSchema);
