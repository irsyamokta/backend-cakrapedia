import prisma from "../config/db.js";

export const getCategory = async (name) => {
    return prisma.category.findUnique({ where: { name: name } })
};

export const getCategoryById = async (categoryId) => {
    return prisma.category.findUnique({ where: { id: categoryId } });
};

export const createCategory = async (name) => {
    return prisma.category.create({ data: { name: name } });
};