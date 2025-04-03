import prisma from "../config/db.js";

export const updateUserPassword = async (userId, password) => prisma.user.update({ where: { id: userId }, data: { password, resetToken: null, resetExpires: null } });

export const updateUserResetToken = async (userId, resetToken, resetExpires) => prisma.user.update({ where: { id: userId }, data: { resetToken, resetExpires } });