import prisma from "../config/db.js";
import { createNewsValidator, updateNewsValidator, newsStatusValidator } from "../utils/validators/index.js";
import { uploadImage } from "./uploadService.js";
import { BadRequestError, NotFoundError } from "../utils/errors/errors.js";

export const getAllNews = async () => {
    return { news: await prisma.news.findMany({ include: { author: { select: { id: true, name: true } } } }) };
};

export const getNewsPublished = async () => {
    return { news: await prisma.news.findMany({ where: { status: "PUBLISHED" }, include: { author: { select: { id: true, name: true } } } }) };
};

export const getNewsByCategory = async (categoryId) => {
    return { news: await prisma.news.findMany({ where: { categoryId }, include: { author: { select: { id: true, name: true } } } }) };
};

export const getNewsByAuthor = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    return { news: await prisma.news.findMany({ where: { authorId: userId } }) };
};

export const createNews = async (userId, data, file) => {
    if (!file) throw new BadRequestError("Gambar tidak boleh kosong!", ["Upload gambar diperlukan"]);

    const { error } = createNewsValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const { title, content, categoryId } = data;
    const imageUrl = await uploadImage(file, "news");

    const author = await prisma.user.findUnique({ 
        where: { id: userId, role: { in: ["JURNALIS", "EDITOR"] } }, 
        select: { id: true } 
    });
    if (!author) throw new NotFoundError("Penulis tidak ditemukan");

    const news = await prisma.news.create({
        data: { title, content, imageUrl: imageUrl.fileUrl, categoryId, authorId: userId }
    });

    return { message: "Berita berhasil dibuat", news };
};

export const updateNews = async (userId, newsId, data, file) => {
    if (!file) throw new BadRequestError("Gambar tidak boleh kosong!", ["Upload gambar diperlukan"]);

    const { error } = updateNewsValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const { title, content, categoryId } = data;
    const imageUrl = await uploadImage(file, "news");

    const news = await prisma.news.findUnique({ where: { id: newsId } });
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if (!["EDITOR", "ADMIN"].includes(user.role) && news.authorId !== user.id) 
        throw new BadRequestError("Anda tidak memiliki izin untuk mengubah berita ini", ["Anda bukan penulis berita ini"]);

    const updatedNews = await prisma.news.update({
        where: { id: newsId },
        data: {
            title: title ?? news.title,
            content: content ?? news.content,
            imageUrl: imageUrl.fileUrl ?? news.imageUrl,
            categoryId: categoryId ?? news.categoryId
        }
    });

    return { message: "Berita berhasil diperbarui", updatedNews };
};

export const deleteNews = async (userId, newsId) => {
    const news = await prisma.news.findUnique({ where: { id: newsId } });
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if (!["EDITOR", "ADMIN"].includes(user.role) && news.authorId !== user.id) 
        throw new BadRequestError("Anda tidak memiliki izin untuk menghapus berita ini", ["Anda bukan penulis berita ini"]);

    await prisma.news.delete({ where: { id: newsId } });

    return { message: "Berita berhasil dihapus" };
};

export const toggleSavedNews = async (userId, newsId) => {
    const existingSavedNews = await prisma.savedNews.findFirst({ where: { userId, newsId } });

    if (existingSavedNews) {
        await prisma.savedNews.delete({ where: { id: existingSavedNews.id } });
        return { message: "Berita berhasil dihapus dari daftar simpan" };
    }

    const savedNews = await prisma.savedNews.create({
        data: { userId, newsId }
    });

    return { message: "Berita berhasil disimpan", savedNews };
};

export const toggleLikeDislike = async (userId, newsId, { type }) => {
    if (!["LIKE", "DISLIKE"].includes(type))
        throw new BadRequestError("Tipe tidak valid", ["Tipe harus LIKE atau DISLIKE"]);

    const existingReaction = await prisma.likesDislikes.findFirst({ where: { userId, newsId } });

    if (existingReaction) {
        if (existingReaction.type === type) {
            await prisma.likesDislikes.delete({ where: { id: existingReaction.id } });
            return { message: `${type} dihapus`, status: "removed" };
        } else {
            await prisma.likesDislikes.update({ where: { id: existingReaction.id }, data: { type } });
            return { message: `Berhasil mengubah menjadi ${type}`, status: "updated" };
        }
    }

    await prisma.likesDislikes.create({ data: { userId, newsId, type } });
    return { message: `Berhasil ${type}` };
};

export const addComment = async (userId, newsId, { content }) => {
    if (!content || content.trim() === "")
        throw new BadRequestError("Komentar tidak boleh kosong!", ["Harap isi komentar sebelum mengirim"]);

    const recentComment = await prisma.comment.findFirst({
        where: { userId, newsId, createdAt: { gte: new Date(Date.now() - 10 * 1000) } }
    });
    if (recentComment) throw new BadRequestError("Tunggu sebentar sebelum berkomentar lagi!", ["Komentar terlalu cepat"]);

    const newComment = await prisma.comment.create({
        data: { userId, newsId, content },
        select: { id: true, content: true, createdAt: true, user: { select: { id: true, name: true } } }
    });

    return { message: "Komentar berhasil dibuat", comment: newComment };
};

export const deleteComment = async (userId, commentId) => {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundError("Komentar tidak ditemukan");

    if (comment.userId !== userId)
        throw new BadRequestError("Anda tidak memiliki izin untuk menghapus komentar ini", ["Komentar bukan milik Anda"]);

    await prisma.comment.delete({ where: { id: commentId } });

    return { message: "Komentar berhasil dihapus" };
};