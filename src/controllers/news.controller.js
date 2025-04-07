import * as newsService from "../services/news.service.js";

export const createNews = async (req, res, next) => {
    try {
        const response = await newsService.createNews(req.user.userId, req.body, req.file);
        res.status(201).json({...response});  
    } catch (error) {
        next(error);
    }
};