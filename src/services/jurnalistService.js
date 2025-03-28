import prisma from "../config/db.js";
import { BadRequestError, NotFoundError } from "../utils/errors/errors.js";

export const createNews = async (body) => {

    const { title, content, categoryId } = body;

    const author = await prisma.user.findFirst({ where: { role: "JURNALIS" }, select: { id: true, name: true } });

    if (!author) throw new NotFoundError("Penulis tidak ditemukan");

    const news = await prisma.news.create({
        data: {
            title,
            content,
            categoryId,
            authorId: author.id
        },
    });

    return { message: "Berita berhasil dibuat", news };
};