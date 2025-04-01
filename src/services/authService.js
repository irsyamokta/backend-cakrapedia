import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as tokenService from "./tokenService.js";
import * as emailService from "../utils/email/index.js";
import { registerValidator, loginValidator } from "../utils/validators/index.js";
import { BadRequestError, UnauthorizedError, ForbiddenError, ConflictError } from "../utils/errors/errors.js";

export const register = async (data) => {
    const { error } = registerValidator(data);

    if (error) {
        const messages = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", messages);
    }

    const { name, email, password, birthDate, gender } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) throw new ConflictError("Akun sudah terdaftar");

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    try {
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    birthDate: new Date(birthDate),
                    gender,
                    verificationToken
                },
            });

            await emailService.sendVerificationEmail(name, email, verificationToken);

            return newUser;
        });

        return {
            status: "success",
            message: "Akun berhasil dibuat",
            data: { id: user.id, name: user.name, email: user.email, birthDate: user.birthDate, gender: user.gender },
        };
    } catch (error) {
        console.log(error);
    }
};

export const login = async (data, res) => {
    const { error } = loginValidator(data);

    if (error) {
        const messages = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", messages);
    }

    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedError("Akun tidak ditemukan");
    if (!user.isVerified) throw new UnauthorizedError("Email belum diverifikasi");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedError("Kredensial tidak valid");

    const { accessToken, refreshToken } = tokenService.generateTokens(user);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    res.cookie("refreshToken", refreshToken, tokenService.cookieOptions());

    return {
        status: "success",
        message: "Login berhasil",
        accessToken,
        data: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
};

export const logout = async (cookies) => {
    const { refreshToken } = cookies;
    if (!refreshToken) return;

    const user = await prisma.user.findFirst({ where: { refreshToken } });

    if (user) {
        await prisma.user.update({ where: { id: user.id }, data: { refreshToken: null } });
    }
};

export const refreshToken = async (cookies, res) => {
    const { refreshToken } = cookies;
    if (!refreshToken) throw new UnauthorizedError("Tidak ada token yang diberikan");

    const user = await prisma.user.findFirst({ where: { refreshToken } });
    if (!user) throw new ForbiddenError("Refresh Token tidak valid");

    const newTokens = tokenService.refreshTokens(user);
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newTokens.refreshToken } });

    res.cookie("refreshToken", newTokens.refreshToken, tokenService.cookieOptions());

    return { accessToken: newTokens.accessToken };
};

export const verifyEmail = async (token) => {
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) throw new BadRequestError("Token verifikasi tidak valid");

    await prisma.user.update({ where: { id: user.id }, data: { isVerified: true, verificationToken: null, status: "APPROVED" } });

    return { status: "success", message: "Email berhasil diverifikasi" };
};