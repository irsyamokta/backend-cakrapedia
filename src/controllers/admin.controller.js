import * as adminService from "../services/admin.service.js"
import { getUsers } from "../controllers/user.controller.js"

export { getUsers };

export const getUserRequestRole = async (req, res, next) => {
    try {
        const result = await adminService.getRoleRequest();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateUserRequestRole = async (req, res, next) => {
    try {
        const result = await adminService.updatUserRoleRequest(req.params.requestId, req.user.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const result = await adminService.createCategory(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const result = await adminService.getCategories();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const result = await adminService.deleteCategory(req.params.categoryId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteUserById = async (req, res, next) => {
    try {
        const result = await adminService.deleteUserById(req.params.userId, req.user.id);
        res.status(200).json({ status: "success", ...result });
    } catch (error) {
        next(error);
    }
};