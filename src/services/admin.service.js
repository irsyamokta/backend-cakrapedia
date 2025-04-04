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

    const categoryExist = await categoryRepository.getCategory(name);
    if (categoryExist) throw new BadRequestError("Kategori sudah ada", ["Tidak dapat membuat kategori baru"]);

    const createCategory = await categoryRepository.createCategory(name);

    return { message: "Kategori berhasil dibuat", createCategory };
};