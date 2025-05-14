import * as newsRepository from "../repositories/news.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import * as categoryRepository from "../repositories/category.repository.js";
import { createNewsValidator, updateNewsValidator, newsStatusValidator } from "../utils/validators/index.js";
import { uploadImage, deleteImageFromCloudinary } from "../utils/upload.utils.js";
import { BadRequestError, NotFoundError } from "../utils/errors.utils.js";

export const getNews = async (page, limit) => {
    const news = await newsRepository.getNews(page, limit);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");
    return news;
};

export const getNewsById = async (newsId) => {
    const news = await newsRepository.getNewsById(newsId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");
    return { news };
};

export const getNewsPublished = async () => {
    const news = await newsRepository.getNewsPublished();
    if (!news) throw new NotFoundError("Berita tidak ditemukan");
    return { news };
};

export const getNewsByCategory = async (categoryId) => {
    const news = await newsRepository.getNewsByCategory(categoryId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    return news;
};

export const getNewsByAuthor = async (authorId) => {
    const news = await newsRepository.getNewsByAuthor(authorId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    return news;
};

export const createNews = async (userId, data, file) => {
    if (!file) throw new BadRequestError("Gambar tidak boleh kosong!", ["Upload gambar diperlukan"]);

    const { error } = createNewsValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const { title, content, categoryId } = data;
    const { fileUrl, publicId } = await uploadImage(file, "news");

    const author = await newsRepository.getAuthor(userId);
    if (!author) throw new NotFoundError("Penulis tidak ditemukan");

    const newsData = {
        title,
        content,
        imageUrl: fileUrl,
        publicId,
        authorId: author.id,
        categoryId
    };
    const createNews = await newsRepository.createNews(newsData);

    return createNews;
};

export const updateNews = async (userId, newsId, data, file) => {
    const { error } = updateNewsValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const news = await newsRepository.getNewsById(newsId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    const user = await userRepository.getUserById(userId, { id: true, role: true });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    const { title, content, categoryId, editorId, status, rejectReason } = data;
    let imageUrl = news.imageUrl;
    let publicId = news.publicId;

    if (file) {
        if (publicId) {
            await deleteImageFromCloudinary(publicId);
        }

        const result = await uploadImage(file, "news");
        imageUrl = result.fileUrl;
        publicId = result.publicId;
    }

    if (!["EDITOR", "ADMIN"].includes(user.role) && news.authorId !== user.id)
        throw new BadRequestError("Anda tidak memiliki izin untuk mengubah berita ini", ["Anda bukan penulis berita ini"]);

    const newsData = {
        publicId: publicId ?? news.publicId,
        imageUrl: imageUrl ?? news.imageUrl,
        title: title ?? news.title,
        content: content ?? news.content,
        imageUrl: imageUrl.fileUrl ?? news.imageUrl,
        categoryId: categoryId ?? news.categoryId,
        status: status ?? news.status,
        rejectReason: rejectReason ?? news.rejectReason,
        editorId: editorId ?? news.editorId
    };
    
    const updatedNews = await newsRepository.updateNews(newsId, newsData);

    return updatedNews;
};

export const deleteNews = async (userId, newsId) => {
    const news = await newsRepository.getNewsById(newsId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    const user = await userRepository.getUserById(userId, { id: true, role: true });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if (!["EDITOR", "ADMIN"].includes(user.role) && news.authorId !== user.id)
        throw new BadRequestError("Anda tidak memiliki izin untuk menghapus berita ini", ["Anda bukan penulis berita ini"]);

    if (news.publicId) {
        await deleteImageFromCloudinary(news.publicId);
    }

    await newsRepository.deleteNews(newsId);

    return { message: "Berita berhasil dihapus" };
};

export const newsStatus = async (userId, newsId, data) => {
    const { error } = newsStatusValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const news = await newsRepository.getNewsById(newsId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    const user = await userRepository.getUserById(userId, { id: true, role: true });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if (!["ADMIN"].includes(user.role) && news.authorId !== user.id)
        throw new BadRequestError("Anda tidak memiliki izin untuk mengubah status berita ini", ["Anda bukan penulis berita ini"]);

    const { status } = data;
    const updatedNews = await newsRepository.newsStatus(newsId, status);

    return updatedNews;
};