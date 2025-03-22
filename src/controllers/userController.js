import prisma from "../config/db.js";

export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, name: true, email: true, role: true }
        });

        if (!user) {
            return res.status(404).json(
                {
                    status: "fail",
                    message: "User not found",
                }
            );
        }

        res.json(user);
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
        const { name, email } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: { name, email },
            select: { id: true, name: true, email: true, role: true }
        });

        res.json({
            status: "success",
            message: "User profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json(
            {
                status: "error",
                error: "Error updating user profile"
            }
        );
    }
};