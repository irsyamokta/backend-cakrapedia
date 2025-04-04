import prisma from "../config/db.js";

export const getCategory = async (name) => {
    return prisma.category.findUnique({ where: { name: name } })
};

export const createCategory = async (name) => {
    return prisma.category.create({ data: { name: name } });
};