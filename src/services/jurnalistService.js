import prisma from "../config/db.js";
import { createNewsValidator, updateNewsValidator } from "../utils/validators/index.js";
import { BadRequestError, NotFoundError } from "../utils/errors/errors.js";

export const getNews = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const news = await prisma.news.findMany({ where: { authorId: user.id } });

    return { news };
}

export const createNews = async (data) => {
    const { error } = createNewsValidator(data);
    if (error) {
        const messages = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", messages);
    }

    const { title, content, categoryId } = data;

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

export const updateNews = async (userId, newsId, data) => {
    const { error } = updateNewsValidator(data);
    if (error) {
        const messages = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", messages);
    }

    const { title, content, categoryId } = data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const news = await prisma.news.findUnique({ where: { id: newsId } });
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    if (news.authorId !== user.id) throw new BadRequestError("Anda tidak memiliki izin untuk mengubah berita ini", ["Anda bukan penulis berita ini"]);

    const updatedNews = await prisma.news.update({
        where: { id: newsId },
        data: {
            title: title || news.title,
            content: content || news.content,
            categoryId: categoryId ?? news.categoryId
        },
    });

    return { message: "Berita berhasil diperbarui", updatedNews };
};

export const deleteNews = async (userId, newsId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const news = await prisma.news.findUnique({ where: { id: newsId } });
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    if (news.authorId !== user.id) throw new BadRequestError("Anda tidak memiliki izin untuk menghapus berita ini", ["Anda bukan penulis berita ini"]);

    await prisma.news.delete({ where: { id: newsId } });

    return { message: "Berita berhasil dihapus" };
};
