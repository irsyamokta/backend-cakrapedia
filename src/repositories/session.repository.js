import prisma from "../config/db.js";

export const createSession = async (userId, refreshToken, userAgent, ipAddress) => {
    return prisma.session.create({
        data: {
            userId,
            refreshToken,
            userAgent,
            ipAddress,
        },
    });
};

export const findByRefreshToken = async (refreshToken) => {
    return prisma.session.findFirst({ where: { refreshToken, isValid: true } });
};

export const invalidateSession = async (refreshToken) => {
    return prisma.session.updateMany({ where: { refreshToken }, data: { isValid: false } });
};

export const deleteSession = async (refreshToken) => {
    return prisma.session.deleteMany({ where: { refreshToken } });
};