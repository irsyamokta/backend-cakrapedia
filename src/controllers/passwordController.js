import * as passwordService from "../services/passwordService.js";
import { changePasswordValidator, forgotPasswordValidator, resetPasswordValidator } from "../utils/validators/index.js";

export const changePassword = async (req, res, next) => {
    try {
        const { error } = changePasswordValidator(req.body);
        if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

        const response = await passwordService.changeUserPassword(req.user.userId, req.body.currentPassword, req.body.newPassword);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { error } = forgotPasswordValidator(req.body);
        if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

        const response = await passwordService.forgotUserPassword(req.body.email);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { error } = resetPasswordValidator(req.body);
        if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

        const response = await passwordService.resetUserPassword(req.body.token, req.body.newPassword);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};