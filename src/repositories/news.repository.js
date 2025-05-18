import prisma from "../config/db.js";


export const getAuthor = async (userId) => prisma.user.findUnique({ where: { id: userId, role: { notIn: ["READER"] } }, select: { id: true } });

export const getNewsById = async (newsId) => prisma.news.findUnique({ where: { id: newsId } });

export const getNews = async ({ page = 1, limit = 10, search = "", status = "" }) => {
    const skip = (page - 1) * limit;

    const where = {
        AND: [
            search ? { title: { contains: search, mode: "insensitive" } } : {},
            status ? { status } : {}
        ]
    };

    const [news, total] = await Promise.all([
        prisma.news.findMany({
            where,
            skip,
            take: limit,
            include: {
                author: { select: { name: true } },
                category: { select: { id: true, name: true } },
                editor: { select: { name: true } }
            }
        }),
        prisma.news.count({ where })
    ]);

    return {
        news,
        total,
        page,
        lastPage: Math.ceil(total / limit)
    };
}


export const getNewsPublished = async () => prisma.news.findMany({ where: { status: "PUBLISHED" }, include: { author: { select: { id: true, name: true } } } });

export const getNewsByCategory = async (categoryId) => prisma.news.findMany({ where: { categoryId }, include: { author: { select: { id: true, name: true } } } });

export const getNewsByAuthor = async (userId, { page = 1, limit = 10, search = "", status = "" }) => {
    const skip = (page - 1) * limit;

    const where = {
        AND: [
            search ? { title: { contains: search, mode: "insensitive" } } : {},
            status ? { status } : {}
        ]
    };

    const [news, total] = await Promise.all([
        prisma.news.findMany({
            where: { authorId: userId, ...where },
            skip,
            take: limit,
            include: {
                author: { select: { name: true } },
                category: { select: { id: true, name: true } },
                editor: { select: { name: true } }
            }
        }),
        prisma.news.count({ where: { authorId: userId, ...where } })
    ]);

    return {
        news,
        total,
        page,
        lastPage: Math.ceil(total / limit)
    };
}

export const createNews = async (data) => prisma.news.create({ data });


export const updateNews = async (newsId, data) => {
    return prisma.news.update({
        where: { id: newsId },
        data
    });
};

export const deleteNews = async (newsId) => prisma.news.delete({ where: { id: newsId } });

export const newsStatus = async (newsId, status) => prisma.news.update({ where: { id: newsId }, data: { status } });

export const updateNewsViews = async (newsId) => prisma.news.update({ where: { id: newsId }, data: { views: { increment: 1 } } });