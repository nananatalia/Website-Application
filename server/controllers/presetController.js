import { prisma } from "../config/db.js";
import wss from '../config/wss.js'

const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return [r, g, b]
        }

const getPresets = async (req, res) =>  {
    try {
        const userId = Number(req.user.id);
        const presets = await prisma.colorPreset.findMany({
            where: { userId },
            orderBy: { createdAt: "asc"}
        });
        res.status(200).json({ status: "success", data: { presets } });
    } catch (error) {
        console.error("Błąd podczas pobierania ustawień:", error)
        res.status(500).json({ error: "Wystąpił błąd podczas pobierania presetów" })
    }
}

// tworzenie nowego preseta
const createPreset = async (req, res) => {
    try {
        const userId = Number(req.user.id)
        const {name, color1, color2, color3, color4, color5, clock, analyzerBrightness, clockBrightness} = req.body

        if (!name || !color1 || !color2 || !color3 || !color4 || !color5) {
            return res.status(400).json({error: "Wszystkie pola są wymagane."});
        }

        const preset = await prisma.colorPreset.create({
            data: { userId, name, color1, color2, color3, color4, color5,
                clock: clock ?? "#ffffff",
                analyzerBrightness: analyzerBrightness ?? 100,
                clockBrightness: clockBrightness ?? 1
             }
        });
        res.status(201).json({ status: 'success', data: {preset}});
    } catch (error) {
        console.error("Błąd podczas tworzenia presetu.", error)
        res.status(500).json({ error: "Wystąpił błąd podczas tworzenia presetu."})
    }
}

// edytowanie istniejącego presetu
const updatePreset = async (req, res) => {
    try {
        const userId = Number(req.user.id)
        const presetId = Number(req.params.id)
        const {name, color1, color2, color3, color4, color5, clock, analyzerBrightness, clockBrightness} = req.body;

        const existing = await prisma.colorPreset.findUnique({
            where: {id: presetId}
        })
        if (!existing || existing.userId !== userId) {
            return res.status(404).json({ error: "Nie znaleziono presetu."})
        }

        const preset = await prisma.colorPreset.update({
            where: {id: presetId},
            data: {name, color1, color2, color3, color4, color5, clock, analyzerBrightness, clockBrightness}
        });

        res.status(200).json({ status: "success", data: {preset}});
    } catch (error) {
        console.error("Błąd podczas edycji presetu.", error);
        res.status(500).json({error: "Wystąpił błąd podczas edycji presetu."})
    }
};

const deletePreset = async (req, res) => {
    try {
        const userId = Number(req.user.id)
        const presetId = Number(req.params.id)

        const existing = await prisma.colorPreset.findUnique({where: {id: presetId }})
        if (!existing || existing.userId !== userId) {
            return res.status(404).json({error: "Nie znaleziono presetu."})
        }

        await prisma.colorPreset.delete({ where: { id: presetId }})

        res.status(200).json({status: "success", message: "Preset został usunięty."})
    } catch (error) {
        console.error("Błąd podczas usuwania presetu.", error)
        res.status(500).json({error: "Wystąpił błąd podczas usuwania presetu."})
    }
};

// aktywacja presetu i wyłączenie innych
const activePreset = async (req, res) => {
    try {
        const userId = Number(req.user.id);
        const presetId = Number(req.params.id);

        const existing = await prisma.colorPreset.findUnique({ where: { id: presetId } });
        if (!existing || existing.userId !== userId) {
            return res.status(404).json({ error: 'Preset nie znaleziony.' });
        }

        // wyłączanie wszystkich presetów użytkownika
        await prisma.colorPreset.updateMany({
            where: { userId },
            data: { isActive: false }
        });

        // włącz wybrany preset
        const preset = await prisma.colorPreset.update({
            where: { id: presetId },
            data: { isActive: true }
        });

        // wysyłamy kolory do Raspberry Pi
        const colorData = JSON.stringify({
            stage_1: hexToRgb(preset.color1),
            stage_2: hexToRgb(preset.color2),
            stage_3: hexToRgb(preset.color3),
            stage_4: hexToRgb(preset.color4),
            stage_5: hexToRgb(preset.color5),
            //stage_5: [255, 255, 255], // piąty kolor - biały domyślnie, możesz dodać color5 do bazy
            clock: hexToRgb(preset.clock),
            analyzerBrightness: preset.analyzerBrightness,
            clockBrightness: preset.clockBrightness
        })

        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(colorData)
                console.log('Wysłano kolory do urządzenia:', colorData)
            }
        })

        res.status(200).json({status: "success", data: { preset }})
    } catch (error) {
        console.error("Błąd podczas aktywacji presetu: ", error);
        res.status(500).json({error: "Wystąpił błąd podczas aktywacji presetu."})
    }
};



export { getPresets, createPreset, updatePreset, deletePreset, activePreset }