import * as jurnalistService from "../services/jurnalistService.js";

export const createNews = async (req, res, next) => {
    try {
        const response = await jurnalistService.createNews(req.body);
        res.status(201).json({status: "success", ...response});  
    } catch (error) {
        next(error);
    }
};