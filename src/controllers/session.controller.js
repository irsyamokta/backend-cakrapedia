import * as sessionService from "../services/session.service.js";

export const getAllSessions = async (req, res, next) => {
    try {
        const response = await sessionService.getAllSessions();
        return res.json(response);
    } catch (error) {
        next(error);
    }
};