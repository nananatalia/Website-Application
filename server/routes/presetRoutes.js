import { Router } from "express";
import { getPresets, createPreset, updatePreset, deletePreset, activePreset } from "../controllers/presetController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// użytkownik musi byc zalogowany aby móc korzystać z tych tras (presetów)
router.get("/", authMiddleware, getPresets);
router.post("/", authMiddleware, createPreset);
router.put("/:id", authMiddleware, updatePreset);
router.delete("/:id", authMiddleware, deletePreset);
router.put("/:id/active", authMiddleware, activePreset);

export default router;