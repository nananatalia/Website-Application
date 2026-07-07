import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { Server }  from 'socket.io';
import { createServer } from 'http';
import presetRoutes from './routes/presetRoutes.js'

config();
connectDB();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Definicja dozwolonych źródeł (origins) dla CORS
const allowedOrigins = [
    'http://localhost:5173', // Frontend development
    // moja produkcyjna domena np. 'analizator.pl'
]

// CORS middleware
app.use(cors({
    //origin: 'http://localhost:5173',
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("nie dozwolony origin"))
        }
    },
    // pozwól na wysyłanie ciasteczek (credentials) z tego origin
    credentials: true,
    // dozwolone metody HTTP
    methods: ["GET", "POST", "PUT", "DELETE"],
    // dozwolone nagłówki
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // 24 godziny w sekundach - jak długo przeglądarka może cache'ować odpowiedź preflight
}));


//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/presets", presetRoutes);

// serwer http z elspress
const server = createServer(app);

// inicjalizacja socket.io
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    }
})

// obsługa połączeń WebSocket
io.on("connection", (socket) => {
    console.log("Nowe połączenie:", socket.id);

    // urządzenie wysyła dane częstotliwości
    socket.on("frequencies", (data) => {
        // przekazuje dane do wszystkich podłączonych fromontendów (dashboardów)
        io.emit("frequencies", data);
    })

    socket.on("disconnect", () => {
        console.log("Rozłączono:", socket.id);
    })
})

// endpoint http do testowania połączenia
app.post("/api/urzadzenia/frequencies", (req, res) => {
    const { frequencies } = req.body;
    if (!frequencies || !Array.isArray(frequencies)) {
        return res.status(400).json({ error: "Nieprawidłowe dane" });
    }
    // przekazuje dane di wszystkich podłączonych fromontendów (dashboardów)
    io.emit("frequencies", frequencies);
    res.status(200).json({ status: "Success" });
})

server.listen(process.env.PORT || 5001, () => {
    console.log(`Server running on PORT ${process.env.PORT || 5001}`);
});


process.on("unhandledRejection", (err) => {     // Obsługa nieobsłużonych odrzuceń obietnic (np. błędy w asynchronicznych funkcjach)
    console.error("Nieobsłużony błąd: ", err);  // Loguj błąd, ale nie zamykaj serwera
    server.close(async () => {        // Zamknij serwer, ale poczekaj, aż wszystkie bieżące żądania zostaną obsłużone
        await disconnectDB(); // Upewnij się, że rozłączasz się z bazą danych przed zamknięciem serwera
        process.exit(1); // Zakończ proces z kodem błędu
    })
})

process.on("uncaughtException", async (err) => {
    console.error("Nieobsłużony wyjątek: ", err);  // Loguj błąd, ale nie zamykaj serwera
    await disconnectDB(); // Upewnij się, że rozłączasz się z bazą danych przed zamknięciem serwera
    process.exit(1); // kończy proces z kodem błędu
})

// Obsługa sygnału SIGTERM gdy proces jest zamykany (np. przez system operacyjny lub platformę hostingową)
process.on("SIGTERM", async () => {
    console.log("Otrzymano sygnał SIGTERM, zamykanie serwera...");
    server.close(async () => {
        await disconnectDB(); // Upewnij się, że rozłączasz się z bazą danych przed zamknięciem serwera
        process.exit(0); // Zakończ proces z kodem sukcesu
    })
})


//app.get('/', (req, res) => {
    //res.send('Hello World!');
//})
//
//app.listen(3000, () => {
    //console.log('Server is running on port 3000');
//})


