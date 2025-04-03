import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as authRepository from "../repositories/auth.repository.js";
import * as tokenService from "../utils/token.utils.js";
import * as emailService from "../utils/email/index.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import { registerValidator, loginValidator } from "../utils/validators/index.js";
import { BadRequestError, UnauthorizedError, ForbiddenError } from "../utils/errors.utils.js";

export const register = async (data) => {
    const { error } = registerValidator(data);
    if (error) {
        const messages = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", messages);
    }

    const { name, email, password, birthDate, gender } = data;

    const existingUser = await authRepository.getUserByEmail(email);
    if (existingUser) throw new ForbiddenError("Akun sudah terdaftar");

    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword)
    const verificationToken = crypto.randomBytes(32).toString("hex");

    try {
        const user = await authRepository.createUser({
            name,
            email,
            password: hashedPassword,
            birthDate: new Date(birthDate),
            gender,
            verificationToken
        });

        await emailService.sendVerificationEmail(name, email, verificationToken);

        return {
            message: "Akun berhasil dibuat. Silahkan verifikasi email Anda",
            data: { id: user.id, name: user.name, email: user.email, role: user.role }
        };
    } catch (error) {
        throw new Error(error);
    }
};

export const login = async (data, res) => {
    const { error } = loginValidator(data);
    if (error) {
        const messages = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", messages);
    }

    const { email, password } = data;

    const user = await authRepository.getUserByEmail(email);
    if (!user) throw new UnauthorizedError("Akun tidak ditemukan");
    if (!user.isVerified) throw new UnauthorizedError("Email belum diverifikasi");

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) throw new UnauthorizedError("Kredensial tidak valid");

    const { accessToken, refreshToken } = tokenService.generateTokens(user);
    await authRepository.updateUserRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, tokenService.cookieOptions());

    return {
        message: "Login berhasil",
        accessToken,
        data: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
};

export const logout = async (cookies) => {
    const { refreshToken } = cookies;
    if (!refreshToken) return;

    const user = await authRepository.getUserByRefreshToken(refreshToken);
    if (user) {
        await authRepository.updateUserRefreshToken(user.id, null);
    }

    return { message: "Berhasil logout" }
};

export const refreshToken = async (cookies, res) => {
    const { refreshToken } = cookies;
    if (!refreshToken) throw new UnauthorizedError("Tidak ada token yang diberikan");

    const user = await authRepository.getUserByRefreshToken(refreshToken);
    if (!user) throw new ForbiddenError("Refresh Token tidak valid");

    const newTokens = tokenService.refreshTokens(user);
    await authRepository.updateUserRefreshToken(user.id, newTokens.refreshToken);

    res.cookie("refreshToken", newTokens.refreshToken, tokenService.cookieOptions());

    return { accessToken: newTokens.accessToken };
};

export const verifyEmail = async (token) => {
    const user = await authRepository.getUserByVerificationToken(token);
    if (!user) throw new UnauthorizedError("Token tidak valid");

    await authRepository.verifyUserEmail(user.id);

    return { message: "Email berhasil diverifikasi" };
};