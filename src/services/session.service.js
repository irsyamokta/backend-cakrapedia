import * as sessionRepository from "../repositories/session.repository.js";
import * as tokenService from "../utils/token.utils.js";

export const createSession = async (userId, userAgent, ipAddress) => {
    const refreshToken = tokenService.generateRefreshToken({ id: userId });
    await sessionRepository.createSession(userId, refreshToken, userAgent, ipAddress);
    const accessToken = tokenService.generateAccessToken({ id: userId });
    return { accessToken, refreshToken };
};

export const rotateRefreshToken = async (oldRefreshToken, req) => {
    const session = await sessionRepository.findByRefreshToken(oldRefreshToken);
    if (!session) throw new Error("Refresh token tidak valid atau sesi sudah kedaluwarsa");

    await sessionRepository.invalidateSession(oldRefreshToken);

    const newRefreshToken = tokenService.generateRefreshToken({ id: session.userId });
    await sessionRepository.createSession(session.userId, newRefreshToken, req.get("user-agent"), req.ip);
    const accessToken = tokenService.generateAccessToken({ id: session.userId });

    return { accessToken, newRefreshToken };
};

export const invalidateSession = async (refreshToken) => {
    return sessionRepository.invalidateSession(refreshToken);
};

export const deleteSession = async (refreshToken) => {
    return sessionRepository.deleteSession(refreshToken);
};