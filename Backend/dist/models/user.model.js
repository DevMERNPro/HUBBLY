"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const base_model_1 = require("./base.model");
const userSchema = new mongoose_1.Schema(base_model_1.IbaseUserSchema, { lastname: String, timestamps: true });
exports.User = (0, mongoose_1.model)("users", userSchema);
