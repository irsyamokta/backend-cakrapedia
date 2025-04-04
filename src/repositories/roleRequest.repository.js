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

export const getUserRequestRole = async (requestId) => {
    return prisma.userRequest.findUnique({ where: { id: requestId }, include: { user: true } });
};

export const updateUserRequestRole = async (requestId, action, adminId) => {
    return prisma.userRequest.update({
        where: { id: requestId },
        data: {
            status: action,
            reviewedById: adminId,
            reviewedAt: new Date()
        }
    });
};