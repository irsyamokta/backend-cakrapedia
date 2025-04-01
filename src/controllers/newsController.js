import * as newsService from "../services/newsService.js";


export const getAllNews = async (req, res, next) => {
    try {
        const response = await newsService.getAllNews();
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const getNewsByCategory = async (req, res, next) => {
    try {
        const response = await newsService.getNewsByCategory(req.params.categoryId);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const getNewsPublished = async (req, res, next) => {
    try {
        const response = await newsService.getNewsPublished();
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const getNewsByAuthor = async (req, res, next) => {
    try {
        const response = await newsService.getNewsByAuthor(req.user.userId);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const createNews = async (req, res, next) => {
    try {
        const response = await newsService.createNews(req.user.userId, req.body, req.file);
        res.status(201).json({status: "success", ...response});  
    } catch (error) {
        next(error);
    }
};

export const updateNews = async (req, res, next) => {
    try {
        const response = await newsService.updateNews(req.user.userId, req.params.newsId, req.body, req.file);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const deleteNews = async (req, res, next) => {
    try {
        const response = await newsService.deleteNews(req.user.userId, req.params.newsId);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const newsStatus = async (req, res, next) => {
    try {
        const response = await newsService.newsStatus(req.user.userId, req.params.newsId, req.body);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const likesDislikes = async (req, res, next) => {
    try {
        const response = await newsService.toggleLikeDislike(req.user.userId, req.params.newsId, req.body);
        res.status(201).json({ status: "success", ...response });  
    } catch (error) {
        next(error);
    }
};

export const savedNews = async (req, res, next) => {
    try {
        const response = await newsService.toggleSavedNews(req.user.userId, req.params.newsId);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const addComment = async (req, res, next) => {
    try {
        const response = await newsService.addComment(req.user.userId, req.params.newsId, req.body);
        res.status(201).json({ status: "success", ...response });  
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const response = await newsService.deleteComment(req.user.userId, req.params.commentId);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};