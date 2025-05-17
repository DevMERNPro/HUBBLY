"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStatus = exports.RoleEnum = void 0;
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["ADMIN"] = "ADMIN";
    RoleEnum["USER"] = "USER";
    RoleEnum["EMPLOYEE"] = "EMPLOYEE";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["PENDING"] = "PENDING";
    SessionStatus["PROGRESS"] = "PROGRESS";
    SessionStatus["COMPLETED"] = "COMPLETED";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
