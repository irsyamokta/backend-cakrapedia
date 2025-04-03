import prisma from "../config/db.js";

export const getUserByEmail = async (email) => prisma.user.findUnique({ where: { email } });

export const createUser = async (data) => prisma.user.create({
    data: {
        name: data.name,
        email: data.email,
        password: data.password,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        verificationToken: data.verificationToken
    }
});

export const updateUserRefreshToken = async (userId, refreshToken) => prisma.user.update({ where: { id: userId }, data: { refreshToken } });

export const getUserByRefreshToken = async (refreshToken) => prisma.user.findFirst({ where: { refreshToken } });

export const getUserByVerificationToken = async (verificationToken) => prisma.user.findFirst({ where: { verificationToken } });

export const verifyUserEmail = async (userId) => prisma.user.update({ where: { id: userId }, data: { isVerified: true, verificationToken: null, status: "APPROVED" } });