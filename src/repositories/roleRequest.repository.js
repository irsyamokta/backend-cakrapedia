import prisma from "../config/db.js";

export const getExistingRequest = async (userId, status) => {
    return prisma.userRequest.findFirst({
        where: { id: userId, status: status }
    });
};

export const getUserRequestRole = async ({ page = 1, limit = 10, search = "", status = "" }) => {
    const skip = (page - 1) * limit;

    const where = {
        AND: [
            search ? { user: { name: { contains: search, mode: "insensitive" } } } : {},
            status ? { status } : {}
        ]
    };

    const [requests, total] = await Promise.all([
        prisma.userRequest.findMany({
            where,
            skip,
            take: limit,
            include: {
                user: true,
                reviewedBy: {
                    select: {
                        name: true,
                    },
                },
            },
        }),
        prisma.userRequest.count({ where })
    ]);

    return {
        requests,
        total,
        page,
        lastPage: Math.ceil(total / limit)
    };
};

export const getUserRequestRoleById = async (requestId) => {
    return prisma.userRequest.findUnique({ where: { id: requestId }, include: { user: true } });
};

export const getUserRequestRoleByUserId = async (userId) => {
    return prisma.userRequest.findFirst({ where: { userId: userId }, include: { user: true } });
};

export const createUserRequestRole = async (data) => prisma.userRequest.create({ data });

export const updateUserRequestRole = async (requestId, data) => prisma.userRequest.update({ where: { id: requestId }, data });

export const deleteUserRequestRole = async (requestId) => {
    return prisma.userRequest.delete({ where: { id: requestId } });
};

export const deleteMany = async (userId) => prisma.userRequest.deleteMany({ where: { userId } });