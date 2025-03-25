import prisma from "../config/db.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendForgotPasswordEmail } from "../utils/email/index.js";
import { NotFoundError, BadRequestError, UnauthorizedError } from "../utils/errors/errors.js";

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (inputPassword, userPassword) => {
    return await bcrypt.compare(inputPassword, userPassword);
};

export const generateResetToken = () => {
    return {
        resetToken: crypto.randomBytes(32).toString("hex"),
        resetExpires: new Date(Date.now() + 3600000) // Berlaku 1 jam
    };
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) throw new UnauthorizedError("Password saat ini tidak sesuai");

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });

    return { message: "Password berhasil diubah" };
};

export const forgotUserPassword = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const { resetToken, resetExpires } = generateResetToken();
    await prisma.user.update({ where: { id: user.id }, data: { resetToken, resetExpires } });

    await sendForgotPasswordEmail(user.name, email, resetToken);

    return { message: "Password reset email berhasil dikirim" };
};

export const resetUserPassword = async (token, newPassword) => {
    const user = await prisma.user.findFirst({ where: { resetToken: token, resetExpires: { gt: new Date() } } });
    if (!user) throw new BadRequestError("Token reset tidak valid atau telah kadaluarsa");

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, resetToken: null, resetExpires: null }
    });

    return { message: "Password berhasil direset" };
};
