"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketSchema = exports.updateEmployeeSchema = exports.EmployeeSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    lastName: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    phone: zod_1.z.string().optional(),
    confirmPassword: zod_1.z.string().optional(),
}).refine((data) => {
    if (data.confirmPassword !== undefined) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.EmployeeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    admin: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    confirmPassword: zod_1.z.string().optional(),
}).refine((data) => {
    if (data.confirmPassword !== undefined) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.updateEmployeeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    admin: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    confirmPassword: zod_1.z.string().optional(),
});
exports.ticketSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID is required"), // Must be a valid ObjectId in real use
    employeeId: zod_1.z.string().optional(), // Optional for ticket creation
    subject: zod_1.z.string().min(1, "Subject is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    status: zod_1.z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional().default("OPEN"),
    priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("LOW"),
});
