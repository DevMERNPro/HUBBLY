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
exports.paginationChecker = void 0;
/**
 * @description Middleware to check if the user has provided the pagination query params or not and if not then set the default values
 */
const paginationChecker = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, limit } = req.query;
    if (!page)
        page = "1";
    if (!limit)
        limit = "5";
    req.query.page = page;
    req.query.limit = limit;
    next();
});
exports.paginationChecker = paginationChecker;
