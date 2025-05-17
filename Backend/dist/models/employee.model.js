"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const mongoose_1 = require("mongoose");
const base_model_1 = require("./base.model");
const employeeSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, base_model_1.IbaseUserSchema), { admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "admin",
        required: true
    } }), { timestamps: true }); // Options as second parameter
exports.Employee = (0, mongoose_1.model)("employee", employeeSchema);
