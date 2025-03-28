import prisma from "../config/db.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email/index.js";
import { NotFoundError, BadRequestError } from "../utils/errors/errors.js";

export const getUserProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, birthDate: true, gender: true, role: true }
    });

    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    return user;
};

export const updateUserProfile = async (userId, { name, email, birthDate, gender }) => {
    const existingUser = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!existingUser) throw new NotFoundError("Akun tidak ditemukan");

    let verificationToken = null;
    let isVerified = true;
    let message = "User profile berhasil diperbarui";

    if (email && email !== existingUser.email) {
        verificationToken = crypto.randomBytes(32).toString("hex");
        isVerified = false;
        await sendVerificationEmail(name, email, verificationToken);
        message = "Email verifikasi telah dikirim";
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            email,
            birthDate: birthDate ? new Date(birthDate) : null,
            gender,
            isVerified,
            verificationToken
        },
        select: { id: true, name: true, email: true, birthDate: true, gender: true, role: true },
    });

    return { updatedUser, message };
};

export const requestRoleChange = async (userId, data) => {

    const { roleRequested, portfolio } = data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const existingRequest = await prisma.userRequest.findFirst({
        where: {
            userId,
            status: "PENDING"
        }
    });

    if (existingRequest) throw new BadRequestError("Tidak dapat membuat permintaan baru", ["Permintaan sudah dikirim sebelumnya"]);

    const userRequest = await prisma.userRequest.create({ data: { userId, roleRequested, portfolio }, });

    return { message: "Permintan berhasil dikirim", userRequest };
};
