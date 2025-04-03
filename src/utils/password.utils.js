import crypto from "crypto";
import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

export const verifyPassword = async (inputPassword, userPassword) => {
    return bcrypt.compare(inputPassword, userPassword);
};

export const generateResetToken = () => {
    return {
        resetToken: crypto.randomBytes(32).toString("hex"),
        resetExpires: new Date(Date.now() + 3600000) // Berlaku 1 jam
    };
};