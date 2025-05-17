"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const base_model_1 = require("./base.model");
const adminSchema = new mongoose_1.Schema(base_model_1.IbaseUserSchema, { lastname: String, timestamps: true });
exports.Admin = (0, mongoose_1.model)("admin", adminSchema);
