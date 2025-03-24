import prisma from "../config/db.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/Email.js";

export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, name: true, email: true, birthDate: true, gender: true, role: true }
        });

        if (!user) {
            return res.status(404).json(
                {
                    status: "fail",
                    message: "User not found",
                }
            );
        }

        res.json(
            {
                status: "success",
                data: user
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                status: "error",
                error: "Error fetching user profile"
            }
        );
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email, birthDate, gender } = req.body;
        const userId = req.user.userId;

        const existingUser = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });

        if (!existingUser) {
            return res.status(404).json(
                {
                    status: "fail",
                    message: "User not found",
                }
            );
        }

        let verificationToken = null;
        let isVerified = false;

        if (email && email !== existingUser.email) {
            verificationToken = crypto.randomBytes(32).toString("hex");
            isVerified = false;

            await sendVerificationEmail(name, email, verificationToken);
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                name, email, birthDate: new Date(birthDate), gender, isVerified,
                verificationToken
            },
            select: { id: true, name: true, email: true, birthDate: true, gender: true, role: true },
        });

        res.json({
            status: "success",
            message: email !== existingUser.email ? "Verification email sent" : "User profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json(
            {
                status: "error",
                error: error.message || "Error updating user profile"
            }
        );
    }
};