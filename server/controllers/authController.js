import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

    // sprawdzanie, czy użytkownik istnieje
    // jeśli istnieje, zwróć błąd
    // jeśli nie istnieje, utwórz nowego użytkownika w bazie danych
    // zwróć odpowiedź z informacją o sukcesie lub błędzie
        const userExists = await prisma.user.findUnique({
            where: { email: email },
        });
    
        if (userExists) {
            return res
                .status(400)
                .json({ error: "Użytkownik o podanym emailu już istnieje" });
        }

        // Hashiwanie hasła przed zapisaniem do bazy danych (za pomocą bcrypt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tworzenie nowego użytkownika w bazie danych
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });

        // generowanie tokena JWT
        const token = generateToken(user.id, res);

        res.status(201).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    name: name,
                    email: email,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Błąd podczas rejestracji:", error);
        res.status(500).json({ error: "Wystąpił błąd podczas rejestracji" });
    }    
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // sprawdzanie, czy użytkownik o podanym emailu już istnieje
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res
                .status(401)
                .json({ error: "Nieprawidłowy email lub hasło" });
        }

        // weryfikowanie hasła
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ error: "Nieprawidłowy email lub hasło" });
        }

        // generowanie tokena JWT
        const token = generateToken(user.id, res);

        res.status(200).json({  // kod 201 jest używany do oznaczenia, że zasób został pomyślnie utworzony, ale w przypadku logowania lepiej użyć kodu 200, który oznacza, że żądanie zostało pomyślnie przetworzone
            status: "success",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: email,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Błąd podczas logowania:", error);
        res.status(500).json({ error: "Wystąpił błąd podczas logowania" });
    }
};

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        expires: new Date(0), // Ustawia datę wygaśnięcia na przeszłość, co powoduje usunięcie ciasteczka
        httpOnly: true,      
    })
    res.status(200).json({
        status: "success",
        message: "Wylogowano pomyślnie",
    });
};

export { register, login, logout };