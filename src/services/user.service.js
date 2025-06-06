import crypto from "crypto";
import * as userRepository from "../repositories/user.repository.js";
import * as roleRequestRpository from "../repositories/roleRequest.repository.js";
import { uploadImage, deleteImageFromCloudinary } from "../utils/upload.utils.js";
import { sendVerificationEmail } from "../utils/email/index.js";
import { NotFoundError, BadRequestError } from "../utils/errors.utils.js";
import { updateProfileValidator } from "../utils/validators/index.js";

export const getUsers = async ({ page = 1, limit = 10, search = "", role = "" }) => {
    const result = await userRepository.getUsers({ page, limit, search, role });
    return result;
};

export const getUserById = async (userId) => {
    return userRepository.getUserById(userId,
        { id: true, name: true, email: true, birthDate: true, gender: true, role: true, imageUrl: true });
};

export const updateUser = async (userId, data, file) => {
    const { error } = updateProfileValidator(data);
    if (error) {
        const message = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", message);
    }

    const user = await userRepository.getUserById(userId, { email: true, publicId: true });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const { name, email, birthDate, gender, phone, instagram } = data;
    let imageUrl = user.imageUrl;
    let publicId = user.publicId;

    if (file) {
        if (publicId) {
            await deleteImageFromCloudinary(publicId);
        }

        const result = await uploadImage(file, "profile");
        imageUrl = result.fileUrl;
        publicId = result.publicId;
    }

    let updateData = {
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        phone,
        instagram,
        imageUrl,
        publicId
    };

    let message = "User profile berhasil diperbarui";

    if (email && email !== user.email) {
        const emailExists = await userRepository.getUserByEmail(email);
        if (emailExists) throw new BadRequestError("Email sudah digunakan!", ["Email sudah terdaftar"]);

        updateData.isVerified = false;
        updateData.verificationToken = crypto.randomBytes(32).toString("hex");

        await sendVerificationEmail(name, email, updateData.verificationToken);
        message = "Email verifikasi telah dikirim";
    }

    const updatedUser = await userRepository.updateUser(userId, updateData);

    return { updatedUser, message };
};

export const deleteUser = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if (user.role === "ADMIN" || user.role === "JURNALIS") throw new BadRequestError("Anda tidak memiliki izin untuk menghapus akun ini", ["Tidak dapat menghapus akun"]);

    if (user.publicId) {
        await deleteImageFromCloudinary(user.publicId);
    }

    await roleRequestRpository.deleteMany(userId);

    await userRepository.deleteUser(userId);

    return { message: "Akun berhasil dihapus" };
};

export const deleteUserById = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if (user.publicId) {
        await deleteImageFromCloudinary(user.publicId);
    }

    await roleRequestRpository.deleteMany(userId);

    await userRepository.deleteUser(userId);

    return { message: "Akun berhasil dihapus" };
};