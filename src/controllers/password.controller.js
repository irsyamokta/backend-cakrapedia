import * as passwordService from "../services/password.service.js"

export const changeUserPassword = async (req, res, next) => {
    try {
        const result = await passwordService.changeUserPassword(req.user.id, req.body);
        res.status(200).json({ status: "success", ...result });
    } catch (error) {
        next(error);
    }
};

export const forgotUserPassword = async (req, res, next) => {
    try {
        const result = await passwordService.forgotUserPassword(req.body);
        res.status(200).json({ status: "success", ...result });
    } catch (error) {
        next(error);
    }
};

export const resetUserPassword = async (req, res, next) => {
    try {
        const result = await passwordService.resetUserPassword(req.body);
        res.status(200).json({ status: "success", ...result })
    } catch (error) {
        next(error);
    }
};