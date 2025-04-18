import * as newsActionRepository from "../repositories/newsAction.repository.js";
import { BadRequestError, NotFoundError } from "../utils/errors.utils.js";

export const toggleSavedNews = async (userId, newsId) => {
    const existingSavedNews = await newsActionRepository.existingSavedNews(userId, newsId);
    if (existingSavedNews) {
        await newsActionRepository.deleteExistingSavedNews(existingSavedNews.id);
        return { message: "Berita berhasil dihapus dari daftar simpan" };
    }

    const savedNews = await newsActionRepository.savedNews(userId, newsId);

    return { message: "Berita berhasil disimpan", savedNews };
};

export const toggleLikeDislike = async (userId, newsId, { type }) => {
    if (!["LIKE", "DISLIKE"].includes(type))
        throw new BadRequestError("Tipe tidak valid", ["Tipe harus LIKE atau DISLIKE"]);

    const existingReaction = await newsActionRepository.existingReaction(userId, newsId);
    if (existingReaction) {
        if (existingReaction.type === type) {
            await newsActionRepository.deleteExistingReaction(existingReaction.id);
            return { message: `${type} dihapus`, status: "removed" };
        } else {
            await newsActionRepository.updateExistingReaction(existingReaction.id, { type });
            return { message: `Berhasil mengubah menjadi ${type}`, status: "updated" };
        }
    }

    await newsActionRepository.addReaction(userId, newsId, type);
    return { message: `Berhasil ${type}` };
};

export const addComment = async (userId, newsId, { content }) => {
    if (!content || content.trim() === "")
        throw new BadRequestError("Komentar tidak boleh kosong!", ["Harap isi komentar sebelum mengirim"]);

    const recentComment = await newsActionRepository.recentComment(userId, newsId);
    if (recentComment) throw new BadRequestError("Tunggu sebentar sebelum berkomentar lagi!", ["Komentar terlalu cepat"]);

    const addComment = await newsActionRepository.addComment(userId, newsId, { content });

    return { message: "Komentar berhasil dibuat", comment: addComment };
};

export const deleteComment = async (userId, commentId) => {
    const findComment = await newsActionRepository.findComment(commentId);
    if (!findComment) throw new NotFoundError("Komentar tidak ditemukan");

    if (findComment.userId !== userId){
        throw new BadRequestError("Anda tidak memiliki izin untuk menghapus komentar ini", ["Komentar bukan milik Anda"]);
    }

    await newsActionRepository.deleteComment(commentId);

    return { message: "Komentar berhasil dihapus" };
};