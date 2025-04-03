import prisma from "../config/db.js";

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

export const deleteUser = async (userId) => {
    return prisma.user.delete({
        where: { id: userId }
    });
};
