import * as adminService from "../services/admin.service.js"
import { getUsers } from "../controllers/user.controller.js"

export { getUsers };

export const reviewRoleRequest = async (req, res, next) => {
    try {
        const result = await adminService.reviewRoleRequest(req.params.requestId, req.user.userId, req.body);
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