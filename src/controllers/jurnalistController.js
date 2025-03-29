import * as jurnalistService from "../services/jurnalistService.js";

export const getNews = async (req, res, next) => {
    try {
        const response = await jurnalistService.getNews(req.user.userId);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const createNews = async (req, res, next) => {
    try {
        const response = await jurnalistService.createNews(req.body);
        res.status(201).json({status: "success", ...response});  
    } catch (error) {
        next(error);
    }
};

export const updateNews = async (req, res, next) => {
    try {
        const response = await jurnalistService.updateNews(req.user.userId, req.params.newsId, req.body);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const deleteNews = async (req, res, next) => {
    try {
        const response = await jurnalistService.deleteNews(req.user.userId, req.params.newsId);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
}