import * as userRepository from "../repositories/user.repository.js";
import * as roleRequestRpository from "../repositories/roleRequest.repository.js";
import * as categoryRepository from "../repositories/category.repository.js";
import { BadRequestError, NotFoundError } from "../utils/errors.utils.js";


export const reviewRoleRequest = async (requestId, adminId, data) => {
    const { action } = data;

    const getRequest = await roleRequestRpository.getUserRequestRole(requestId);
    if (!getRequest) throw new NotFoundError("Permintaan tidak ditemukan");

    if (getRequest.status !== "PENDING") throw new BadRequestError("Permintaan tidak valid", ["Permintaan sudah diproses sebelumnya"]);

    const updatedRequest = await roleRequestRpository.updateUserRequestRole(requestId, action, adminId);

    if (action === "APPROVED") {
        await userRepository.updateUserRole(getRequest.userId, getRequest.roleRequested, action);
    }

    return { message: `Permintaan ${action === "APPROVED" ? "disetujui" : "ditolak"}`, updatedRequest };
};

export const createCategory = async (data) => {
    const { name } = data;

    const categoryExist = await categoryRepository.getCategoriesByName(name);
    console.log(categoryExist);
    if (categoryExist) throw new BadRequestError("Kategori sudah ada", ["Tidak dapat membuat kategori baru"]);

    const createCategory = await categoryRepository.createCategory(name);

    return { message: "Kategori berhasil dibuat", createCategory };
};

export const getCategories = async () => {
    const categories = await categoryRepository.getCategories();
    if (!categories) throw new NotFoundError("Kategori tidak ditemukan");

    return { message: "Kategori berhasil diambil", categories };
};

export const deleteCategory = async (categoryId) => {
    const category = await categoryRepository.getCategoryById(categoryId);
    if (!category) throw new NotFoundError("Kategori tidak ditemukan");

    await categoryRepository.deleteCategory(categoryId);
    return { message: "Kategori berhasil dihapus" };
};

export const deleteUserById = async (userId, adminId) => {
    const user = await userRepository.getUserById(userId);
    if(!user) throw new NotFoundError("Akun tidak ditemukan");

    const admin = await userRepository.getUserById(adminId);
    if (!admin) throw new NotFoundError("Admin tidak ditemukan");
    if (userId === adminId) throw new BadRequestError("Admin tidak dapat menghapus akun sendiri", ["Tidak dapat menghapus akun"]);
    if (admin.role !== "ADMIN") throw new BadRequestError("Anda tidak memiliki izin untuk menghapus akun ini", ["Tidak dapat menghapus akun"]);
        
    await userRepository.deleteUser(userId);
    return { message: "Akun berhasil dihapus" };
};