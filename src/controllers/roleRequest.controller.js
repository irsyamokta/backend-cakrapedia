import * as roleRequestService from "../services/roleRequest.service.js";

export const getUserRoleRequests = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await roleRequestService.getUserRoleRequests(page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const createUserRoleRequest = async (req, res, next) => {
    try {
        const result = await roleRequestService.createUserRoleRequest(req.user.id, req.body, req.file);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateUserRoleRequest = async (req, res, next) => {
    try {
        const result = await roleRequestService.updateUserRoleRequest(req.params.requestId, req.user.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteUserRoleRequest = async (req, res, next) => {
    try {
        const result = await roleRequestService.deleteUserRoleRequest(req.params.requestId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}