import { getUserProfile, updateUserProfile, requestRoleChange } from "../services/userService.js";
import { updateProfileValidator, requestRoleValidator } from "../utils/validators/index.js";
import { BadRequestError } from "../utils/errors/errors.js";

export const getProfile = async (req, res, next) => {
    try {
        const user = await getUserProfile(req.user.userId);
        res.json({ status: "success", data: user });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { error } = updateProfileValidator(req.body);
        if (error) {
            const messages = error.details.map(err => err.message);
            throw new BadRequestError("Validasi gagal", messages);
        }

        const { updatedUser, message } = await updateUserProfile(req.user.userId, req.body);
        res.json({ status: "success", message, data: updatedUser });
    } catch (error) {
        next(error);
    }
};

export const requestRole = async (req, res, next) => {
    try {
        const { error } = requestRoleValidator(req.body);
        
        if (error) {
            const messages = error.details.map(err => err.message);
            throw new BadRequestError("Validasi gagal", messages);
        }

        const { requestedRole, message } = await requestRoleChange(req.user.userId, req.body);
        res.json({ status: "success", message, data: requestedRole });  
    } catch (error) {
        next(error);
    }
};