import * as categoryService from "../services/category.service.js";

export const getCategories = async (req, res, next) => {
    try {
        const result = await categoryService.getCategories();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req, res, next) => {
    try {
        const result = await categoryService.getCategoryById(req.params.categoryId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const result = await categoryService.createCategory(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const result = await categoryService.updateCategory(req.params.categoryId, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const result = await categoryService.deleteCategory(req.params.categoryId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};