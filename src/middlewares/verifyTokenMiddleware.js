import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ valid: false });

    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        res.json({ valid: true, user });
    } catch (err) {
        res.status(403).json({ valid: false, message: err.message });
    }
};