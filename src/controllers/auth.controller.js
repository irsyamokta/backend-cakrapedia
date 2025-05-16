import * as authService from "../services/auth.service.js";
import * as tokenService from "../utils/token.utils.js";

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
        const result = await authService.login(req.body, req, res);
        res.status(200).json({ status: "success", ...result });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        await authService.logout(req.cookies);
        res.clearCookie("refreshToken", tokenService.cookieOptions());
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const result = await authService.refreshToken(req.cookies, req, res);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const me = async (req, res, next) => {
    try {
        const result = await authService.me(req.user.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        await authService.verifyEmail(req.params.token);
        res.redirect(`${process.env.FRONTEND_URL}/verified/${req.params.token}`);
    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/signin`);
    }
};

