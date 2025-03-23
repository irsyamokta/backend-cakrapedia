import nodemailer from "nodemailer";
import { emailVerifyTemplate, emailForgotPasswordTemplate } from "../utils/EmailTemplate.js";

export const sendVerificationEmail = async (name, email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const verificationLink = `http://localhost:3000/api/v1/auth/verify/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        html: emailVerifyTemplate(name, verificationLink),
    });
};

export const sendForgotPasswordEmail = async (name, email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const resetLink = `http://localhost:3000/api/v1/auth/reset-password/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password",
        html: emailForgotPasswordTemplate(name, resetLink),
    });
};