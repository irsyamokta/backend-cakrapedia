import prisma from "../config/db.js";

export const getExistingRequest = async (userId, status) => {
    return prisma.userRequest.findFirst({
        where: { id: userId, status: status }
    });
};

export const createUserRequestRole = async (userId, data, file) => {
    return prisma.userRequest.create({
        data: {
            userId: userId,
            roleRequested: data,
            portfolio: file
        }
    })
};

export const getUserRequestRole = async () => {
    return prisma.userRequest.findMany({ where: { status: { in: ["PENDING", "REJECTED"] } }, include: { user: true } });
};

export const getUserRequestRoleById = async (requestId) => {
    return prisma.userRequest.findUnique({ where: { id: requestId }, include: { user: true } });
};

export const updateUserRequestRole = async (requestId, action, reason, adminId) => {
    return prisma.userRequest.update({
        where: { id: requestId },
        data: {
            status: action,
            rejectReason: reason,
            reviewedById: adminId,
            reviewedAt: new Date()
        }
    });
};