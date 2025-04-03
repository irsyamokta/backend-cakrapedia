import nodemailer from "nodemailer";
import { emailVerifyTemplate, emailForgotPasswordTemplate } from "./template.utils.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Fungsi umum untuk mengirim email
 * @param {string} to - Email penerima
 * @param {string} subject - Subjek email
 * @param {string} htmlContent - Konten email dalam format HTML
 */

const sendEmail = async (to, subject, htmlContent) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent,
    });
};

export const sendVerificationEmail = async (name, email, token) => {
    const verificationLink = `http://localhost:3000/api/v1/auth/verify/${token}`;
    await sendEmail(email, "Email Verification", emailVerifyTemplate(name, verificationLink));
};

export const sendForgotPasswordEmail = async (name, email, token) => {
    const resetLink = `http://localhost:3000/api/v1/password/reset/${token}`;
    await sendEmail(email, "Reset Password", emailForgotPasswordTemplate(name, resetLink));
};
