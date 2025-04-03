import prisma from "../config/db.js";
import { BadRequestError, NotFoundError } from "../utils/errors.utils.js";

export const getUsers = async () => {
    const reader = await prisma.user.findMany({ where: { role: "READER" } });
    const jurnalist = await prisma.user.findMany({ where: { role: "JURNALIS" } });
    const editor = await prisma.user.findMany({ where: { role: "EDITOR" } });
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });

    return { data: { users: { reader, jurnalist, editor }, admins } };
};

export const reviewRoleRequest = async (adminId, data) => {
    const { requestId, action } = data;
    const request = await prisma.userRequest.findUnique({ where: { id: requestId }, include: { user: true } });

    if (!request) throw new NotFoundError("Permintaan tidak ditemukan");

    if (request.status !== "PENDING") throw new BadRequestError("Permintaan tidak valid", ["Permintaan sudah diproses sebelumnya"]);

    const updatedRequest = await prisma.userRequest.update({ where: { id: requestId }, data: { status: action, reviewedById: adminId, reviewedAt: new Date() } });

    if (action === "APPROVED") {
        await prisma.user.update({ where: { id: request.userId }, data: { role: request.roleRequested, status: action } });
    }

    return { message: `Permintaan ${action === "APPROVED" ? "disetujui" : "ditolak"}`, updatedRequest };
}

export const createCategory = async (data) => {
    const { name } = data;

    const checkCategory = await prisma.category.findUnique({ where: { name } });
    if (checkCategory) throw new BadRequestError("Kategori sudah ada", ["Tidak dapat membuat kategori baru"]);

    const category = await prisma.category.create({ data: { name } });

    return { message: "Kategori berhasil dibuat", category };
};