import prisma from "../config/db.js";
import { registerValidator, loginValidator } from "../utils/Validator.js";
import { sendVerificationEmail } from "../utils/Email.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
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
                message: "Validasi gagal",
                error: error.details.map(err => err.message)
            }
        );
    }

    const { name, email, password, birthDate, gender } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        
        if (existingUser) return res.status(409).json(
            {
                status: "fail",
                message: "Akun sudah terdaftar"
            }
        );

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, birthDate: new Date(birthDate), gender, verificationToken },
        });

        await sendVerificationEmail(name, email, verificationToken);

        res.status(201).json(
            {
                status: "success",
                message: "Akun berhasil dibuat",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    birthDate: user.birthDate,
                    gender: user.gender
                }
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                status: "error",
                message: "Terjadi kesalahan pada server",
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
                message: "Validasi gagal",
                error: error.details.map(err => err.message)
            }
        );
    }

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(401).json(
            {
                status: "fail",
                message: "Akun tidak ditemukan"
            }
        );

        if (!user.isVerified) return res.status(401).json(
            {
                status: "fail",
                message: "Email belum diverifikasi"
            }
        );

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return res.status(401).json(
            {
                status: "fail",
                message: "Kredensial tidak valid"
            }
        );

        const accessToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            REFRESH_TOKEN_SECRET,
            { algorithm: "HS256", expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
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
                message: "Login berhasil",
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
                message: "Terjadi kesalahan pada server"
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
                message: "Logout berhasil"
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                status: "error",
                message: "Terjadi kesalahan pada server"
            }
        );
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json(
                {
                    status: "unauthorized",
                    error: "Tidak ada token yang diberikan"
                }
            );
        }

        const user = await prisma.user.findFirst({ where: { refreshToken } });

        if (!user) {
            return res.status(403).json(
                {
                    status: "forbidden",
                    error: "Refresh Token tidak valid"
                }
            );
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        if (user.id !== decoded.userId) {
            return res.status(403).json(
                {
                    staus: "forbidden",
                    error: "Refresh Token tidak valid"
                }
            );
        }

        const newRefreshToken = jwt.sign(
            { userId: user.id },
            REFRESH_TOKEN_SECRET,
            { algorithm: "HS256", expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
        );

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
        res.status(500).json(
            {
                ststus: "error",
                error: "Terjadi kesalahan pada server"
            }
        );
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await prisma.user.findFirst({ where: { verificationToken: token } });

        if (!user) return res.status(400).json(
            {
                status: "fail",
                message: "Token verifikasi tidak valid"
            }
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null },
        });

        res.json(
            {
                status: "success",
                message: "Email berhasil diverifikasi"
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                status: "error",
                message: "Terjadi kesalahan pada server"
            }
        );
    }
};