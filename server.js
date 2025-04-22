import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import xssClean from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./src/routes/auth.routes.js";
import passwordRoutes from "./src/routes/password.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import newsRoutes from "./src/routes/news.routes.js";
import newsActionRoutes from "./src/routes/newsAction.routes.js";

const app = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = ["http://localhost:5173", "http://localhost:5000"];

app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(morgan("dev"));
app.use(helmet());
app.use(xssClean());
app.use(hpp());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/password", passwordRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/news-action", newsActionRoutes);
// app.use("/api/v1/editor", newsRoutes);

app.get("/", (req, res) => res.send("Server is running"));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        status: "error",
        message: err.message || "Terjadi kesalahan pada server",
        errors: err.details || undefined,
    });
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
