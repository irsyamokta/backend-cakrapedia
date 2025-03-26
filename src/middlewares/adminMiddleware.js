export const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN" || req.user.status !== "APPROVED") {
        return res.status(403).json(
            {
                status: "forbidden",
                message: "Anda bukan admin"
            }
        );
    }
    next();
};