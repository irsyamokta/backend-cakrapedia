import prisma from "../config/db.js";

export const getUsers = async (role) => {
    return prisma.user.findMany({
        where: { role: `${role}` },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            birthDate: true,
            gender: true,
            imageUrl: true
        }
    });
};

export const getUserById = async (userId, selectedField = null) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: selectedField || undefined
    });
};

export const getUserByEmail = async (email) => prisma.user.findUnique({ where: { email } });

export const updateUserprofile = async (userId, data) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name,
            birthDate: data.birthDate,
            gender: data.gender,
            imageUrl: data.imageUrl
        },
        select: { id: true, name: true, email: true, birthDate: true, gender: true, role: true, imageUrl: true },
    });
};

export const updateUserRole = async (userId, roleRequested, action) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            role: roleRequested,
            status: action
        }
    });
}

export const deleteUser = async (userId) => {
    return prisma.user.delete({
        where: { id: userId }
    });
};
