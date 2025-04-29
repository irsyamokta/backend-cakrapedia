import prisma from "../config/db.js";


export const getAuthor = async (userId) => prisma.user.findUnique({ where: { id: userId, role: { notIn: ["READER"] } }, select: { id: true } });

export const getNewsById = async(newsId) => prisma.news.findUnique({ where: { id: newsId } });

export const getNews = async () => prisma.news.findMany({ 
    include: { 
        author: { select: { name: true } },
        category: { select: { name: true } },
        editor: { select: { name: true } } 
    } 
});

export const getNewsPublished = async () => prisma.news.findMany({ where: { status: "PUBLISHED" }, include: { author: { select: { id: true, name: true } } } });

export const getNewsByCategory = async (categoryId) => prisma.news.findMany({ where: { categoryId }, include: { author: { select: { id: true, name: true } } } });

export const getNewsByAuthor = async (userId) => prisma.news.findMany({ where: { authorId: userId } });

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

export const deleteNews = async (newsId) => prisma.news.delete({ where: { id: newsId } });

export const newsStatus = async (newsId, status) => prisma.news.update({ where: { id: newsId }, data: { status } });

export const updateNewsViews = async (newsId) => prisma.news.update({ where: { id: newsId }, data: { views: { increment: 1 } } });