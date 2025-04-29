import * as newsService from "../services/news.service.js";

export const getNews = async (req, res, next) => {
    try {
        const response = await newsService.getNews();
        res.json({...response});
    } catch (error) {
        next(error);
    }
};

export const getNewsById = async (req, res, next) => {
    try {
        const response = await newsService.getNewsById(req.params.newsId);
        res.json({...response});
    } catch (error) {
        next(error);
    }
};

export const getNewsByCategory = async (req, res, next) => {
    try {
        const response = await newsService.getNewsByCategory(req.params.categoryId);
        res.json({...response});
    } catch (error) {
        next(error);
    }
};

export const getNewsByAuthor = async (req, res, next) => {
    try {
        const response = await newsService.getNewsByAuthor(req.user.id);
        res.json({...response});
    } catch (error) {
        next(error);
    }
};

export const getNewsPublished = async (req, res, next) => {
    try {
        const response = await newsService.getNewsPublished();
        res.json({...response});
    } catch (error) {
        next(error);
    }
}

export const createNews = async (req, res, next) => {
    try {
        const response = await newsService.createNews(req.user.id, req.body, req.file);
        res.status(201).json({...response});  
    } catch (error) {
        next(error);
    }
};

export const updateNews = async (req, res, next) => {
    try {
        const response = await newsService.updateNews(req.user.id, req.params.newsId, req.body, req.file);
        res.json({...response});
    } catch (error) {
        next(error);
    }
};

export const deleteNews = async (req, res, next) => {
    try {
        const response = await newsService.deleteNews(req.user.id, req.params.newsId);
        res.json({...response});
    } catch (error) {
        next(error);
    }
};

export const newsStatus = async (req, res, next) => {
    try {
        const response = await newsService.newsStatus(req.user.id, req.params.newsId, req.body);
        res.json({...response});
    } catch (error) {
        next(error);
    }
};