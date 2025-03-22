import prisma from "../config/db.js";
import { registerValidator, loginValidator } from "../utils/Validator.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const register = async (req, res) => {
    const { error } = registerValidator(req.body);

    if (error) {
        return res.status(400).json(
            {
                status: "fail",
                message: "Validation error",
                error: error.details.map(err => err.message)
            }
        );
    }

    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        res.status(201).json(
            {
                status: "success",
                message: "User registered successfully",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                status: "error",
                message: "Error registering user"
            }
        );
    }
};

export const login = async (req, res) => {
    const { error } = loginValidator(req.body);

    if (error) {
        return res.status(400).json(
            {
                status: "fail",
                message: "Validation error",
                error: error.details.map(err => err.message)
            }
        );
    }

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ status: "fail", message: "User not found" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ status: "fail", message: "Invalid credentials" });

        const accessToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role  },
            ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            path: "/",
        });

        res.json(
            {
                status: "success",
                message: "Login successful",
                accessToken,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                staus: "error",
                message: "Internal Server Error"
            }
        );
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.sendStatus(204);

        const user = await prisma.user.findFirst({ where: { refreshToken } });
        if (!user) return res.sendStatus(204);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: null },
        });

        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Strict", path: "/" });
        res.json(
            {
                status: "success",
                message: "Logout successful"
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                status: "error",
                message: "Error logging out"
            }
        );
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ error: "Unauthorized. No token provided." });
        }

        const user = await prisma.user.findFirst({ where: { refreshToken } });
        if (!user) {
            return res.status(403).json({ error: "Forbidden. Invalid refresh token." });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        if (user.id !== decoded.userId) {
            return res.status(403).json({ error: "Forbidden. Invalid refresh token." });
        }

        const newRefreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const newAccessToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
        );

        res.json({ accessToken: newAccessToken });

    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).json({ error: "Error refreshing token" });
    }
};