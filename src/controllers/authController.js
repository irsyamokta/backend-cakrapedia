import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ExpressAuth  } from "@auth/express";

dotenv.config();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.AUTH_SECRET || "secret";

const auth = ExpressAuth({
    providers: [
        {
            name: "credentials",
            authorize: async (credentials) => {
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });

                if (!user) throw new Error("User not found");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Invalid password");

                return { id: user.id, name: user.name, email: user.email, role: user.role };
            },
        },
    ],
    secret: SECRET_KEY,
    session: { strategy: "jwt" },
});

// Register User
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role },
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const user = await auth.authenticate("credentials", req.body);

        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export default auth;
