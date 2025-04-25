import jwt from "jsonwebtoken";
import { findByRefreshToken } from "../repositories/session.repository.js";

export const authMiddleware = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            status: "unauthorized",
            message: "Tidak ada refresh token di cookie"
        });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const session = await findByRefreshToken(refreshToken);

        if (!session || !session.isValid) {
            return res.status(403).json({
                status: "forbidden",
                message: "Sesi tidak valid"
            });
        }

        req.user = { id: payload.userId };
        next();
    } catch (error) {
        console.error("Refresh Token Verification Error:", error);
        res.status(403).json({
            status: "forbidden",
            message: "Refresh token tidak valid"
        });
    }
};