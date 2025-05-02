
import express from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { hash } from "bcrypt";

// Config & Constants
import CONFIG from "./config";
import { FOLDER_PATH, blueText, greenText, redLogger, redText } from "./constants";

// Middlewares
import { memberAuthHandler } from "./middlewares/AuthHandler";
import { paginationChecker } from "./middlewares/PaginationChecker";
import ErrorHandler from "./middlewares/ErrorHandler";

// Models
import { Admin } from "./models";

// Routes
import control from "./controllers/control";

// Types
import { TokenInfo } from "./types";

// App Init
const app = express();

// Define paths
const publicFolderPath = path.join(process.cwd(), FOLDER_PATH.PUBLIC);
const uploadFolderPath = path.join(publicFolderPath, FOLDER_PATH.UPLOADS);

// Create necessary folders
[publicFolderPath, uploadFolderPath].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log(blueText, `📁 Folder Created: ${dir}`, blueText);
  } else {
    console.log(blueText, `📁 Folder Exists: ${dir}`, blueText);
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
  ],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

// Express Global Middlewares
app.use(morgan("dev"));
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use("/static", express.static(publicFolderPath));

// Health Check Route
app.get("/", (_, res) => {
  res.json({
    status: "OK",
    health: "✅ Good",
    message: `Welcome to the API of ${CONFIG.APP_NAME}`,
  });
});

// Extend Express Request Type
declare global {
  namespace Express {
    interface Request {
      user: TokenInfo;
      prevObject: any;
    }
  }
}

// Init Function
(async () => {
  try {
    if (!CONFIG.DB_URL) {
      throw new Error("Database URL not defined in config");
    }

    console.log(blueText, "📦 Connecting to database...", blueText);
    await mongoose.connect(CONFIG.DB_URL, {
      maxPoolSize: CONFIG.DB_POOL_SIZE,
    });

    console.log(greenText, "✅ Database connected successfully", greenText);

    // Admin seeding
    const admin = await Admin.findOne({ email: "admin@gmail.com" });
    if (!admin) {
      await Admin.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: await hash("admin123", CONFIG.SALT_ROUNDS),
      });
      console.log(greenText, "👤 Admin created", greenText);
    }

    // Start Server
    app.listen(CONFIG.PORT, () => {
      console.log(
        greenText,
        `🚀 Server running on port ${CONFIG.PORT}`,
        greenText
      );
    });
  } catch (error: any) {
    console.log(
      redText,
      "🚨 Server initialization failed:",
      JSON.stringify(error, null, 2),
      redText
    );
    redLogger("🛑 Application Stopped");
    process.exit(1);
  }
})();

// Middlewares & Routes
app.use(paginationChecker);
// app.use(memberAuthHandler); // Uncomment when needed
app.use("/api/v1", control);

// 404 Fallback
// app.use("*", (_, res) => {
//   res.status(404).json({
//     status: "Not Found",
//     health: "❌",
//     msg: "Route Not Found",
//   });
// });

// Error Handler
app.use(ErrorHandler);
