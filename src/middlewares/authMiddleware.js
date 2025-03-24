import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {

    const token =
        (req.cookies && req.cookies.token) ||
        (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) return res.status(401).json(
        {
            status: "unauthorized",
            message: "Tidak ada token yang diberikan"
        }
    );

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(403).json(
            {
                status: "forbidden",
                message: "Token tidak valid"
            }
        );
    }
};