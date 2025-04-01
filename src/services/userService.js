import prisma from "../config/db.js";
import crypto from "crypto";
import { uploadImage, uploadPDF } from "./uploadService.js";
import { sendVerificationEmail } from "../utils/email/index.js";
import { NotFoundError, BadRequestError } from "../utils/errors/errors.js";
import { updateProfileValidator, requestRoleValidator } from "../utils/validators/index.js";

export const getUserProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, birthDate: true, gender: true, role: true, imageUrl: true },
    });

    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    return user;
};

export const updateUserProfile = async (userId, data, file) => {
    const { error } = updateProfileValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const { name, email, birthDate, gender } = data;
    const imageUrl = await uploadImage(file, "profile");    

    let updateData = { name, birthDate: birthDate ? new Date(birthDate) : null, gender, imageUrl: imageUrl.fileUrl };
    let message = "User profile berhasil diperbarui";

    if (email && email !== user.email) {
        const emailExists = await prisma.user.findUnique({ where: { email } });
        if (emailExists) throw new BadRequestError("Email sudah digunakan!", ["Email sudah terdaftar"]);

        updateData.isVerified = false;
        updateData.verificationToken = crypto.randomBytes(32).toString("hex");

        await sendVerificationEmail(name, email, updateData.verificationToken);
        message = "Email verifikasi telah dikirim";
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: { id: true, name: true, email: true, birthDate: true, gender: true, role: true, imageUrl: true },
    });

    return { updatedUser, message };
};

export const requestRoleChange = async (userId, data, file) => {
    const { error } = requestRoleValidator(data);
    if (error) {
        const messages = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", messages);
    }

    const { roleRequested } = data;
    const pdfUrl = await uploadPDF(file);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const existingRequest = await prisma.userRequest.findFirst({
        where: {
            userId,
            status: "PENDING"
        }
    });

    if (existingRequest) throw new BadRequestError("Tidak dapat membuat permintaan baru", ["Permintaan sudah dikirim sebelumnya"]);

    const userRequest = await prisma.userRequest.create({ data: { userId, roleRequested, portfolio: pdfUrl.fileUrl }, });

    return { message: "Permintan berhasil dikirim", userRequest };
};

export const deleteUser = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });    
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if(user.role === "ADMIN" || user.role === "JURNALIS" || user.role === "EDITOR") throw new BadRequestError("Anda tidak memiliki izin untuk menghapus akun ini", ["Tidak dapat menghapus akun"]);
    
    await prisma.user.delete({ where: { id: userId } });    
    return { message: "Akun berhasil dihapus" };    
};
