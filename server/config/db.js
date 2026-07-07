import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log:
        process.env.NODE_ENV === "development"      // pokaż mi logi zapytań, błędów i ostrzeżeń tylko w trybie deweloperskim
            ? ["query", "error", "warn"]            // loguj zapytania, błędy i ostrzeżenia
            : ["error"],                    // loguj tylko błędy w trybie produkcyjnym
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Połączono z bazą danych via Prisma");
    } catch (error) {
        console.error(`Błąd połączenia z bazą danych: ${error.message}`);
        process.exit(1); // Zakończy cały proces node.js, i powie naszemu systemowi,
    }      //że zakończył się z powodu błędu (kod 1 oznacza błąd, a 0 oznacza sukces)
}

// Funkcja do bezpiecznego rozłączania się z bazą danych
const disconnectDB = async () => {
    await prisma.$disconnect();
};

export { connectDB, disconnectDB, prisma };