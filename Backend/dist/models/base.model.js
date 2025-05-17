"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IbaseUserSchema = void 0;
exports.IbaseUserSchema = {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    confirmPassword: { type: String, required: false },
};
