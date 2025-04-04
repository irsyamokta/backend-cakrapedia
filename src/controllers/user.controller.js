import * as userService from "../services/user.service.js"

export const getUsers = async (req, res, next) => {
    try {
        const result = await userService.getUsers();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const result = await userService.getUserProfile(req.user.userId);
        res.status(200).json({ ...result });
    } catch (error) {
        next(error);
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const { result, message } = await userService.updateUserProfile(req.user.userId, req.body, req.file);
        res.status(200).json({ message, data: result });
    } catch (error) {
        next(error);
    }
};

export const requestRoleChange = async (req, res, next) => {
    try {
        const result = await userService.requestRoleChange(req.user.userId, req.body, req.file);
        res.status(200).json({ status: "success", ...result });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const result = await userService.deleteUser(req.user.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};