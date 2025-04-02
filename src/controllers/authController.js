import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({ status: "success", ...result });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body, res);
        res.json({ status: "success", ...result });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        await authService.logout(req.cookies, res.clearCookie);
        res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
        res.json({ status: "success", message: "Logout berhasil" });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const result = await authService.refreshToken(req.cookies, res);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const result = await authService.verifyEmail(req.params.token);
        res.json({ status: "success", result });
    } catch (error) {
        next(error);
    }
};
