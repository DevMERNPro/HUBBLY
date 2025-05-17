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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = require("bcrypt");
// Config & Constants
const config_1 = __importDefault(require("./config"));
const constants_1 = require("./constants");
const PaginationChecker_1 = require("./middlewares/PaginationChecker");
const ErrorHandler_1 = __importDefault(require("./middlewares/ErrorHandler"));
// Models
const models_1 = require("./models");
// Routes
const control_1 = __importDefault(require("./controllers/control"));
// App Init
const app = (0, express_1.default)();
// Define paths
const publicFolderPath = path_1.default.join(process.cwd(), constants_1.FOLDER_PATH.PUBLIC);
const uploadFolderPath = path_1.default.join(publicFolderPath, constants_1.FOLDER_PATH.UPLOADS);
// Create necessary folders
[publicFolderPath, uploadFolderPath].forEach((dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
        console.log(constants_1.blueText, `📁 Folder Created: ${dir}`, constants_1.blueText);
    }
    else {
        console.log(constants_1.blueText, `📁 Folder Exists: ${dir}`, constants_1.blueText);
    }
});
// CORS Config
const corsConfig = {
    credentials: true,
    origin: [
        "http://localhost",
        "http://localhost:80",
        "http://localhost:5173/",
        "http://localhost:5173",
        "https://hubbly.onrender.com",
    ],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
// Express Global Middlewares
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)(corsConfig));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use("/static", express_1.default.static(publicFolderPath));
// Health Check Route
app.get("/", (_, res) => {
    res.json({
        status: "OK",
        health: "✅ Good",
        message: `Welcome to the API of ${config_1.default.APP_NAME}`,
    });
});
// Init Function
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!config_1.default.DB_URL) {
            throw new Error("Database URL not defined in config");
        }
        console.log(constants_1.blueText, "📦 Connecting to database...", constants_1.blueText);
        yield mongoose_1.default.connect(config_1.default.DB_URL, {
            maxPoolSize: config_1.default.DB_POOL_SIZE,
        });
        console.log(constants_1.greenText, "✅ Database connected successfully", constants_1.greenText);
        // Admin seeding
        const admin = yield models_1.Admin.findOne({ email: "admin@gmail.com" });
        if (!admin) {
            yield models_1.Admin.create({
                name: "Admin",
                email: "admin@gmail.com",
                password: yield (0, bcrypt_1.hash)("admin123", config_1.default.SALT_ROUNDS),
            });
            console.log(constants_1.greenText, "👤 Admin created", constants_1.greenText);
        }
        // Start Server
        app.listen(config_1.default.PORT, () => {
            console.log(constants_1.greenText, `🚀 Server running on port ${config_1.default.PORT}`, constants_1.greenText);
        });
    }
    catch (error) {
        console.log(constants_1.redText, "🚨 Server initialization failed:", JSON.stringify(error, null, 2), constants_1.redText);
        (0, constants_1.redLogger)("🛑 Application Stopped");
        process.exit(1);
    }
}))();
// Middlewares & Routes
app.use(PaginationChecker_1.paginationChecker);
// app.use(memberAuthHandler); // Uncomment when needed
app.use("/api/v1", control_1.default);
// 404 Fallback
// app.use("*", (_, res) => {
//   res.status(404).json({
//     status: "Not Found",
//     health: "❌",
//     msg: "Route Not Found",
//   });
// });
// Error Handler
app.use(ErrorHandler_1.default);
