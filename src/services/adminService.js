import prisma from "../config/db.js";
import { BadRequestError, NotFoundError } from "../utils/errors/errors.js";

export const dashboard = async (req, res) => {

    const users = await prisma.user.findMany({ where: { role: "READER" } });
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });

    return {
        status: "success",
        message: "Dashboard berhasil diakses",
        data: { users, admins }
    }
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