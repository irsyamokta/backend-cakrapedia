export const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: "unauthorized",
                message: "Silakan login terlebih dahulu"
            });
        }

        if (!roles.includes(req.user.role) || req.user.status !== "APPROVED") {
            return res.status(403).json({
                status: "forbidden",
                message: `Anda tidak memiliki akses sebagai ${roles.join(" atau ")}`
            });
        }

        next();
    };
};