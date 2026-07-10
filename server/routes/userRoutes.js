import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js"; 

const router = Router();

// użytkownik musi byc zalogowany 
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "To jest chroniony profil użytkownika.", user: req.user });
});

export default router;