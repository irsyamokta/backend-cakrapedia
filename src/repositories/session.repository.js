import DeviceDetector from 'device-detector-js';
import prisma from "../config/db.js";

export const createSession = async (userId, refreshToken, userAgent, ipAddress) => {
    return prisma.session.create({
        data: {
            userId: userId,
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

export const getSessionsCountByDevice = async () => {
    const sessions = await prisma.session.findMany();

    const deviceCounts = {
        mobile: 0,
        desktop: 0,
        tablet: 0,
        unknown: 0,
    };

    const deviceDetector = new DeviceDetector();

    sessions.forEach(session => {
        const device = deviceDetector.parse(session.userAgent);

        const deviceType = device.device?.type || "unknown";

        if (deviceCounts[deviceType] !== undefined) {
            deviceCounts[deviceType] += 1;
        } else {
            deviceCounts.unknown += 1;
        }
    });

    return deviceCounts;
};