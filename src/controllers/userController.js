import * as userService from "../services/userService.js";

export const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserProfile(req.user.userId);
        res.json({ status: "success", data: user });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { updatedUser, message } = await userService.updateUserProfile(req.user.userId, req.body, req.file);
        res.json({ status: "success", message, data: updatedUser });
    } catch (error) {
        next(error);
    }
};

export const requestRole = async (req, res, next) => {
    try {
        const { requestedRole, message } = await userService.requestRoleChange(req.user.userId, req.body, req.file);
        res.json({ status: "success", message, data: requestedRole });  
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await userService.deleteUser(req.user.userId);
        res.json({ status: "success", deletedUser });  
    } catch (error) {
        next(error);
    }
};