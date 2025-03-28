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

export const isJurnalist = (req, res, next) => {
    if (req.user.role !== "JURNALIS" || req.user.status !== "APPROVED") {
        return res.status(403).json(
            {
                status: "forbidden",
                message: "Anda bukan jurnalis"
            }
        );
    }
    next();
};

export const isEditor = (req, res, next) => {
    if (req.user.role !== "EDITOR" || req.user.status !== "APPROVED") {
        return res.status(403).json(
            {
                status: "forbidden",
                message: "Anda bukan editor"
            }
        );
    }
    next();
};