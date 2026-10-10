import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";


//const prisma = new PrismaClient();
// Czytanie tokena z requestu
// Sprawdzenie, czy token jest ważny
export const authMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ error: "Brak tokena, autoryzacja nieudana" });
    }

    try {
        // Weryfikacja tokena i ekstrakcja danych użytkownika
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            // nie zwracamy hasłą, ale inne dane użytkownika
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) {
            return res.status(401).json({ error: " Użytkownik nie istnieje."})
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).json({ error: "Nieprawidłowy token, autoryzacja nieudana" });
    }
};