import prisma from "../config/db.js";


export const getAuthor = async (userId) => prisma.user.findUnique({ where: { id: userId, role: { in: ["JURNALIS", "EDITOR"] } }, select: { id: true } });

export const createNewsData = async (title, content, categoryId, imageUrl, userId) => {
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