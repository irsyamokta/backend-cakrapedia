import prisma from "../config/db.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendForgotPasswordEmail } from "../utils/Email.js";
import { changePasswordValidator, forgotPasswordValidator, resetPasswordValidator } from "../utils/Validator.js";

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const { error } = changePasswordValidator(req.body);

    if (error) {
        return res.status(400).json({
            status: "fail",
            message: "Validasi gagal",
            error: error.details.map(err => err.message)
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user) return res.status(404).json(
            {
                status: "fail",
                message: "Akun tidak ditemukan"
            });

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) return res.status(401).json(
            {
                status: "fail",
                message: "Password saat ini tidak sesuai"
            }
        );

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        res.json(
            {
                status: "success",
                message: "Password berhasil diubah"
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
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const { error } = forgotPasswordValidator(req.body);

    if (error) {
        return res.status(400).json(
            {
                status: "fail",
                message: "Validasi gagal",
                error: error.details.map(err => err.message)
            }
        );
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(404).json(
            {
                status: "fail",
                message: "Akun tidak ditemukan"
            }
        );

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetExpires }
        });

        await sendForgotPasswordEmail(user.name, email, resetToken);

        res.json(
            {
                status: "success",
                message: "Password reset email berhasil dikirim"
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

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    const { error } = resetPasswordValidator(req.body);

    if (error) {
        return res.status(400).json(
            {
                status: "fail",
                message: "Validasi gagal",
                error: error.details.map(err => err.message)
            }
        );
    }

    try {
        const user = await prisma.user.findFirst({ where: { resetToken: token, resetExpires: { gt: new Date() } } });

        if (!user) return res.status(400).json(
            {
                status: "fail",
                message: "Token reset tidak valid atau telah kadaluarsa"
            }
        );

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null, resetExpires: null }
        });

        res.json(
            {
                status: "success",
                message: "Password berhasil direset"
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