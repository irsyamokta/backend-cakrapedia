import * as userService from "../services/user.service.js"

export const getUsers = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search = "", role = "" } = req.query;

        const params = {
            page: parseInt(page),
            limit: parseInt(limit),
            search,
            role
        };

        const result = await userService.getUsers(params);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const result = await userService.getUserById(req.params.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { result, message } = await userService.updateUser(req.user.id, req.body, req.file);
        res.status(200).json({ message, data: result });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const result = await userService.deleteUser(req.user.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteUserById = async (req, res, next) => {
    try {
        const result = await userService.deleteUserById(req.params.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};