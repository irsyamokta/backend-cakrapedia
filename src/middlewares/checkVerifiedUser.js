import prisma from "../config/db.js";

export const checkVerifiedUser = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { isVerified: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Email not verified. Please verify your email first." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
