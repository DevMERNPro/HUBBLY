"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbUserCheckV2 = exports.dbUserCheck = exports.dbCheckBodyUpdate = exports.dbCheckBody = exports.dbCheck = exports.dbUserDelete = exports.dbDelete = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const lib_1 = require("../constants/lib");
const validate = (validationChain) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Promise.all(validationChain.map((validation) => validation.run(req)));
            const errors = (0, express_validator_1.validationResult)(req);
            if (errors.isEmpty()) {
                next();
                return;
            }
            yield (0, lib_1.removeFile)(req.file);
            const msg = errors
                .array()
                .map((err) => err.msg)
                .join("\n");
            return res.status(400).json({ msg });
        }
        catch (error) {
            yield (0, lib_1.removeFile)(req.file);
            res.status(500).json({ msg: error.message });
        }
    });
};
exports.validate = validate;
const dbDelete = (model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const result = yield model.findById(id);
            if (result) {
                req.prevObject = result;
                yield result.deleteOne();
                next();
                return;
            }
            return res
                .status(404)
                .json({ msg: `${model.modelName} with id : ${id} not found` });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};
exports.dbDelete = dbDelete;
const dbUserDelete = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const modelToUse = (0, lib_1.getModelByRole)(role);
            if (!modelToUse) {
                return res.status(400).json({ msg: "Invalid role" });
            }
            const result = yield modelToUse.findById(id);
            if (result) {
                req.prevObject = result;
                yield result.deleteOne();
                next();
                return;
            }
            return res.status(404).json({ msg: `${role} with id : ${id} not found` });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};
exports.dbUserDelete = dbUserDelete;
const dbCheck = (model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const result = yield model.findById(id);
            if (result) {
                req.prevObject = result;
                next();
                return;
            }
            yield (0, lib_1.removeFile)(req.file);
            return res
                .status(404)
                .json({ msg: `${model.modelName} with id : ${id} not found` });
        }
        catch (error) {
            yield (0, lib_1.removeFile)(req.file);
            res.status(500).json({ msg: error.message });
        }
    });
};
exports.dbCheck = dbCheck;
const dbCheckBody = (model, keyToCheck) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let result = null;
            const key = req.body[keyToCheck];
            if (Array.isArray(keyToCheck)) {
                const keysToCheck = keyToCheck.map((key) => {
                    return { [key]: req.body[key] };
                });
                result = yield model.findOne({ $or: keysToCheck });
            }
            else {
                result = yield model.findOne({ [keyToCheck]: key });
            }
            if (!result) {
                next();
                return;
            }
            if (Array.isArray(keyToCheck)) {
                return res.status(404).json({
                    msg: `${model.modelName} same ${keyToCheck.join(", ")} already exists`,
                });
            }
            return res.status(404).json({
                msg: `${model.modelName} with ${keyToCheck} : ${key} already exists`,
            });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};
exports.dbCheckBody = dbCheckBody;
const dbCheckBodyUpdate = (model, keyToCheck) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // this is for update
            const { id } = req.params;
            const key = req.body[keyToCheck];
            const result = yield model.findOne({ [keyToCheck]: key });
            // we are checking if the result is the same as the id
            // if same we are allowing the update
            // else we are sending the error
            if (!result || result._id == id) {
                next();
                return;
            }
            return res.status(404).json({
                msg: `${model.modelName} with ${keyToCheck} : ${key} already exists`,
            });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};
exports.dbCheckBodyUpdate = dbCheckBodyUpdate;
const dbUserCheck = (role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const modelToUse = (0, lib_1.getModelByRole)(role);
            if (!modelToUse) {
                return res.status(400).json({ msg: "Invalid role" });
            }
            const result = yield modelToUse.findById(id);
            if (result) {
                next();
                return;
            }
            return res.status(404).json({ msg: `${role} with id : ${id} not found` });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};
exports.dbUserCheck = dbUserCheck;
const dbUserCheckV2 = (flip = false) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { role, email } = req.body;
            const modelToUse = (0, lib_1.getModelByRole)(role);
            console.log("modelToUse", modelToUse);
            if (!modelToUse) {
                return res.status(400).json({ msg: "Invalid role" });
            }
            let result;
            if (flip) {
                result = yield modelToUse.findOne({ email });
            }
            else {
                result = yield modelToUse.findById(id);
            }
            if (flip) {
                if (!result) {
                    next();
                    return;
                }
                return res
                    .status(400)
                    .json({ msg: `${role} with email : ${email} already exists` });
            }
            if (result) {
                next();
                return;
            }
            return res.status(404).json({ msg: `${role} with id : ${id} not found` });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};
exports.dbUserCheckV2 = dbUserCheckV2;
