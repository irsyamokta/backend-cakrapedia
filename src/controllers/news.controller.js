import * as newsService from "../services/news.service.js";

export const createNews = async (req, res, next) => {
    try {
        const response = await newsService.createNews(req.user.userId, req.body, req.file);
        res.status(201).json({...response});  
    } catch (error) {
        next(error);
    }
};

export const updateNews = async (req, res, next) => {
    try {
        const response = await newsService.updateNews(req.user.userId, req.params.newsId, req.body, req.file);
        res.json({...response});
    } catch (error) {
        next(error);
    }
};

export const deleteNews = async (req, res, next) => {
    try {
        const response = await newsService.deleteNews(req.user.userId, req.params.newsId);
        res.json({...response});
    } catch (error) {
        next(error);
    }
};