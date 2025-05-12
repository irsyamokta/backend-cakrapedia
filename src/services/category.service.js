import * as categoryRepository from "../repositories/category.repository.js";
import { BadRequestError, NotFoundError } from "../utils/errors.utils.js";

export const getCategories = async () => {
    return await categoryRepository.getCategories();
};

export const getCategoryById = async (categoryId) => {
    const category = await categoryRepository.getCategoryById(categoryId);
    if (!category) throw new NotFoundError("Kategori tidak ditemukan");

    return category;
};

export const createCategory = async (data) => {
    const { name } = data;

    const categoryExist = await categoryRepository.getCategoriesByName(name);
    if (categoryExist) throw new BadRequestError("Kategori sudah ada", ["Tidak dapat membuat kategori baru"]);

    const createCategory = await categoryRepository.createCategory(name);

    return { message: "Kategori berhasil dibuat", createCategory };
};

export const updateCategory = async (categoryId, data) => {
    const category = await categoryRepository.getCategoryById(categoryId);
    if (!category) throw new NotFoundError("Kategori tidak ditemukan");

    const { name } = data;

    const categoryExist = await categoryRepository.getCategoriesByName(name);
    if (categoryExist) throw new BadRequestError("Kategori sudah ada", ["Tidak dapat membuat kategori baru"]);

    const updateCategory = await categoryRepository.updateCategory(categoryId, name);

    return { message: "Kategori berhasil diubah", updateCategory };
};

export const deleteCategory = async (categoryId) => {
    const category = await categoryRepository.getCategoryById(categoryId);
    if (!category) throw new NotFoundError("Kategori tidak ditemukan");

    await categoryRepository.deleteCategory(categoryId);
    return { message: "Kategori berhasil dihapus" };
};