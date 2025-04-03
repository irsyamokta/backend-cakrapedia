import prisma from "../config/db.js";

export const checkVerifiedUser = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { isVerified: true }
        });

        if (!user) {
            return res.status(404).json(
                {
                    status: "fail",
                    message: "Akun tidak ditemukan"
                }
            );
        }

        if (!user.isVerified) {
            return res.status(403).json(
                {
                    status: "forbidden",
                    message: "Email tidak diverifikasi. Silakan verifikasi email terlebih dahulu."
                }
            );
        }

        next();
    } catch (error) {
        res.status(500).json(
            {
                status: "error",
                message: "Terjadi kesalahan pada server"
            }
        );
    }
};
