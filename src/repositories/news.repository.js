import prisma from "../config/db.js";


export const getAuthor = async (userId) => prisma.user.findUnique({ where: { id: userId, role: { in: ["JURNALIS", "EDITOR"] } }, select: { id: true } });

export const getNewsById = async(newsId) => prisma.news.findUnique({ where: { id: newsId } });

export const createNews = async (title, content, categoryId, imageUrl, userId) => {
    return prisma.news.create({
        data: {
            title,
            content,
            imageUrl,
            categoryId,
            authorId: userId
        }
    });
};

export const updateNews = async (newsId, data) => {
    return prisma.news.update({ 
        where: { id: newsId }, 
        data
    });
};