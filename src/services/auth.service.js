import crypto from "crypto";
import * as authRepository from "../repositories/auth.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import * as sessionService from "../services/session.service.js";
import * as emailService from "../utils/email/index.js";
import * as tokenService from "../utils/token.utils.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import { registerValidator, loginValidator } from "../utils/validators/index.js";
import { BadRequestError, UnauthorizedError, ForbiddenError } from "../utils/errors.utils.js";

export const register = async (data) => {
    const { error } = registerValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const { name, email, password, birthDate, gender } = data;
    const existingUser = await authRepository.getUserByEmail(email);
    if (existingUser) throw new ForbiddenError("Akun sudah terdaftar");

    const hashedPassword = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await authRepository.createUser({ name, email, password: hashedPassword, birthDate: new Date(birthDate), gender, verificationToken });
    await emailService.sendVerificationEmail(name, email, verificationToken);
    return { message: "Akun berhasil dibuat. Silakan verifikasi email Anda", data: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

export const login = async (data, req, res) => {
    const { error } = loginValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const { email, password } = data;
    const user = await authRepository.getUserByEmail(email);
    if (!user) throw new UnauthorizedError("Akun tidak ditemukan");
    if (!user.isVerified) throw new UnauthorizedError("Email belum diverifikasi");

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) throw new UnauthorizedError("Kredensial tidak valid");

    const userAgent = req.get("user-agent") || "unknown";
    const ipAddress = req.ip;

    const { accessToken, refreshToken } = await sessionService.createSession(user.id, userAgent, ipAddress);
    res.cookie("refreshToken", refreshToken, tokenService.cookieOptions());

    return { message: "Login berhasil", accessToken, data: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

export const logout = async (cookies) => {
    const { refreshToken } = cookies;
    if (refreshToken) await sessionService.invalidateSession(refreshToken);
    return { message: "Berhasil logout" };
};

export const refreshToken = async (cookies, req, res) => {
    const { refreshToken } = cookies;
    if (!refreshToken) throw new UnauthorizedError("Tidak ada token yang diberikan");

    const { accessToken, newRefreshToken } = await sessionService.rotateRefreshToken(refreshToken, req);
    res.cookie("refreshToken", newRefreshToken, tokenService.cookieOptions());
    return { accessToken };
};

export const me = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new UnauthorizedError("Tidak ada token yang diberikan");

    return { data: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

export const verifyEmail = async (token) => {
    const user = await authRepository.getUserByVerificationToken(token);
    if (!user) throw new UnauthorizedError("Token tidak valid");
    await authRepository.verifyUserEmail(user.id);
    return { message: "Email berhasil diverifikasi" };
};
