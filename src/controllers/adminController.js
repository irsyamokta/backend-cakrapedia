import * as adminService from "../services/adminService.js";

export const getDashboard = async (req, res, next) => {
    try {
        const response = await adminService.dashboard();
        return res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const reviewRequest = async (req, res, next) => {
    try {
        const response = await adminService.reviewRoleRequest(req.user.userId, req.body);
        return res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const response = await adminService.createCategory(req.body);
        return res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

