import prisma from "../config/db.js";

export const getCategories = async () => {
    return prisma.category.findMany();
};

export const getCategoriesByName = async (name) => {
    return prisma.category.findUnique({ where: { name: name } });
};

export const getCategoryById = async (categoryId) => {
    return prisma.category.findUnique({ where: { id: categoryId } });
};

export const createCategory = async (name) => {
    return prisma.category.create({ data: { name: name } });
};

export const deleteCategory = async (categoryId) => {
    return prisma.category.delete({ where: { id: categoryId } });
}