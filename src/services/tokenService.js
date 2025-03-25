import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        REFRESH_TOKEN_SECRET,
        { algorithm: "HS256", expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    );

    return { accessToken, refreshToken };
};

export const refreshTokens = (user) => {
    return generateTokens(user);
};

export const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
