import prisma from "../config/db.js";

export const getUsers = async ({ page = 1, limit = 10, search = "", role = "" }) => {
    const skip = (page - 1) * limit;

    const where = {
        AND: [
            search ? { name: { contains: search, mode: "insensitive" } } : {},
            role ? { role } : {}
        ]
    };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                birthDate: true,
                gender: true,
                imageUrl: true,
                isVerified: true,
                status: true,
            }
        }),
        prisma.user.count({ where })
    ]);

    return {
        users,
        total,
        page,
        lastPage: Math.ceil(total / limit)
    };
};

export const getUserById = async (userId, selectedField = null) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: selectedField || undefined
    });
};

export const getUserByEmail = async (email) => prisma.user.findUnique({ where: { email } });

export const updateUser = async (userId, data) => {
    return prisma.user.update({
        where: { id: userId },
        data,
        select: { id: true, name: true, email: true, birthDate: true, gender: true, role: true, imageUrl: true },
    });
};

export const updateUserRole = async (userId, data) => {
    return prisma.user.update({
        where: { id: userId },
        data
    });
}

export const deleteUser = async (userId) => {
    return prisma.user.delete({
        where: { id: userId }
    });
};
