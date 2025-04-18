import * as newsActionService from "../services/newsAction.service.js";

export const toggleSavedNews = async (req, res, next) => {
    try {
        const response = await newsActionService.toggleSavedNews(req.user.userId, req.params.newsId);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const toggleLikeDislike = async (req, res, next) => {
    try {
        const response = await newsActionService.toggleLikeDislike(req.user.userId, req.params.newsId, req.body);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const addComment = async (req, res, next) => {
    try {
        const response = await newsActionService.addComment(req.user.userId, req.params.newsId, req.body);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const response = await newsActionService.deleteComment(req.user.userId, req.params.commentId);
        res.json({ status: "success", ...response });
    } catch (error) {
        next(error);
    }
};