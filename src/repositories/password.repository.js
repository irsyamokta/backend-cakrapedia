import prisma from "../config/db.js";

export const updateUserPassword = async (userId, data) => prisma.user.update({ where: { id: userId }, data });

export const updateUserResetToken = async (userId, resetToken, resetExpires) => prisma.user.update({ where: { id: userId }, data: { resetToken, resetExpires } });