import prisma from "../config/db.js";
import * as userRepository from "../repositories/user.repository.js";
import * as passwordRepository from "../repositories/password.repository.js";
import * as passwordUtils from "../utils/password.utils.js";
import { changePasswordValidator, forgotPasswordValidator, resetPasswordValidator } from "../utils/validators/index.js";
import { sendForgotPasswordEmail } from "../utils/email/index.js";
import { NotFoundError, BadRequestError, UnauthorizedError } from "../utils/errors.utils.js";

export const changeUserPassword = async (userId, data) => {
    const { error } = changePasswordValidator(data);
    if (error) {
        const messages = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", messages);
    }

    const user = await userRepository.getUserById(userId);
    if (!user) throw new NotFoundError("Akun tidak ditemukan");
    if (!user.isVerified) throw new UnauthorizedError("Email belum diverifikasi");

    const isValid = await passwordUtils.verifyPassword(data.currentPassword, user.password);
    if (!isValid) throw new BadRequestError("Password saat ini tidak sesuai", ["Gagal reset password"]);

    const hashedPassword = await passwordUtils.hashPassword(data.newPassword);

    await passwordRepository.updateUserPassword(userId, hashedPassword);

    return { message: "Password berhasil diubah" };
};

export const forgotUserPassword = async (data) => {
    const { error } = forgotPasswordValidator(data);
    if (error) {
        const messages = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", messages);
    }

    const user = await userRepository.getUserByEmail(data.email);
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const { resetToken, resetExpires } = passwordUtils.generateResetToken();
    await passwordRepository.updateUserResetToken(user.id, resetToken, resetExpires);

    await sendForgotPasswordEmail(user.name, data.email, resetToken);

    return { message: "Password reset email berhasil dikirim" };
};

export const resetUserPassword = async (data) => {
    const { error } = resetPasswordValidator(data);
    if (error) {
        const messages = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", messages);
    }

    const user = await prisma.user.findFirst({ where: { resetToken: data.token, resetExpires: { gt: new Date() } } });
    if (!user) throw new BadRequestError("Token reset tidak valid atau telah kadaluarsa", ["Gagal reset password"]);

    const hashedPassword = await passwordUtils.hashPassword(data.newPassword);

    await passwordRepository.updateUserPassword(user.id, hashedPassword)

    return { message: "Password berhasil direset" };
};
