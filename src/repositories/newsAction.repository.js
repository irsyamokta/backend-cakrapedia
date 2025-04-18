import prisma from "../config/db.js";

export const savedNews = async (userId, newsId) => prisma.savedNews.create({ data: { userId, newsId } });

export const existingSavedNews = async (userId, newsId) => prisma.savedNews.findFirst({ where: { userId, newsId } });

export const deleteExistingSavedNews = async (existingSavedNews) => prisma.savedNews.delete({ where: { id: existingSavedNews } });

export const addReaction = async (userId, newsId, type) => prisma.likesDislikes.create({ data: { userId, newsId, type } });

export const existingReaction = async (userId, newsId) => prisma.likesDislikes.findFirst({ where: { userId, newsId } });

export const deleteExistingReaction = async (existingReaction) => prisma.likesDislikes.delete({ where: { id: existingReaction.id } });

export const updateExistingReaction = async (existingReaction, { type }) => prisma.likesDislikes.update({ where: { id: existingReaction }, data: { type } });

export const addComment = async (userId, newsId, { content }) => prisma.comment.create({ data: { userId, newsId, content }, select: { id: true, content: true, createdAt: true, user: { select: { id: true, name: true } } } });

export const recentComment = async (userId, newsId) => prisma.comment.findFirst({ where: { userId, newsId, createdAt: { gte: new Date(Date.now() - 10 * 1000) } } });

export const findComment = async (commentId) => prisma.comment.findUnique({ where: { id: commentId } });

export const deleteComment = async (commentId) => prisma.comment.delete({ where: { id: commentId } });