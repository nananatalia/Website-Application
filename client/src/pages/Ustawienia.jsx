import React from "react";
import SpectrumAnalyzer from "../components/ui/SpectrumAnalyzer";
import SpectrumAnalyzerPreview from "../components/ui/SpectrumAnalyzerPreview.jsx";
import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import Button from "../components/ui/Button.jsx";
import axios from "axios";

const builtInPresets = [
  {
    name: "Klasyczny",
    color1: "#3e96d9",
    color2: "#bf98f2",
    color3: "#ff98ff",
    color4: "#dc2626",
    color5: "#ffffff",
  },
  {
    name: "Ocean",
    color1: "#00ccff",
    color2: "#0077be",
    color3: "#005f99",
    color4: "#003f66",
    color5: "#ffffff",
  },
  {
    name: "Zachód słońca",
    color1: "#ff6b35",
    color2: "#f7931e",
    color3: "#ffc107",
    color4: "#ff3d00",
    color5: "#ffffff",
  },
  {
    name: "Neon",
    color1: "#39ff14",
    color2: "#ff073a",
    color3: "#00f0ff",
    color4: "#ff00ff",
    color5: "#ffffff",
  },
];

const emptyColors = {
  color1: "#3e96d6",
  color2: "#bf98f2",
  color3: "#ff98ff",
  color4: "#dc2626",
  color5: "#ffffff",
  clock: "#ffffff",
  analyzerBrightness: 100,
  clockBrightness: 1,
};

const colorLabels = {
  color1: "Bardzo cicho",
  color2: "Umiarkowanie",
  color3: "Głośno",
  color4: "Bardzo głośno",
  color5: "Opadający cień",
  clock: "Kolor zegara",
};

function Ustawienia() {
  const [colors, setColors] = useState(emptyColors);
  const [presetName, setPresetName] = useState("");
  const [activeColorKey, setActiveColorKey] = useState(null);
  const [presets, setPresets] = useState([]);
  const [activePresetId, setActivePresetId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setIsLoading] = useState(true);

  const fetchPresets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/presets`, {
        withCredentials: true,
      });
      setPresets(res.data.data.presets);
      const active = res.data.data.presets.find((p) => p.isActive);
      if (active) {
        setActivePresetId(active.id);
        setColors({
          color1: active.color1,
          color2: active.color2,
          color3: active.color3,
          color4: active.color4,
          color5: active.color5,
          clock: active.clock ?? "#ffffff",
          analyzerBrightness: active.analyzerBrightness ?? 100,
          clockBrightness: active.clockBrightness ?? 1,
        });
      }
    } catch (err) {
      setError("Nie udało się pobrać presetów.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPresets();
  }, []);

  const clearMessage = () => {
    setError("");
    setSuccess("");
  };

  const handleSaveNew = async () => {
    clearMessage();
    if (!presetName.trim()) {
      setError("Podaj nazwę presetu");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/presets`,
        { name: presetName, ...colors },
        { withCredentials: true },
      );
      setSuccess("Preset został pomyślnie zapisany!");
      setPresetName("");
      fetchPresets();
    } catch (err) {
      setError("Nie udało się zapisać presetu.");
    }
  };

  const handleUpdate = async (id) => {
    clearMessage();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/presets/${id}`,
        { name: presetName, ...colors },
        { withCredentials: true },
      );
      setSuccess("Preset zaktualizowany!");
      setEditingId(null);
      setPresetName("");
      fetchPresets();
    } catch (err) {
      setError("Nie udało się zaktualizować presetu.");
    }
  };

  const handleActive = async (id) => {
    clearMessage();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/presets/${id}/active`,
        {},
        { withCredentials: true },
      );
      const preset = res.data.data.preset;
      setActivePresetId(preset.id);
      setColors({
        color1: preset.color1,
        color2: preset.color2,
        color3: preset.color3,
        color4: preset.color4,
        color5: preset.color5,
        clock: preset.clock ?? "#ffffff",
        analyzerBrightness: preset.analyzerBrightness ?? 100,
        clockBrightness: preset.clockBrightness ?? 1,
      });
      fetchPresets();
    } catch (err) {
      setError("Nie udało się aktywować presetu.");
    }
  };

  const handleDelete = async (id) => {
    clearMessage();
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/presets/${id}`, {
        withCredentials: true,
      });
      setSuccess("Preset usunięty.");
      if (activePresetId === id) setActivePresetId(null);
      fetchPresets();
    } catch (err) {
      setError("Nie udało się usunąć presetu.");
    }
  };

  const handleEditClick = (preset) => {
    setEditingId(preset.id);
    setPresetName(preset.name);
    setColors({
      color1: preset.color1,
      color2: preset.color2,
      color3: preset.color3,
      color4: preset.color4,
      color5: preset.color5,
      clock: preset.clock ?? "#ffffff",
      analyzerBrightness: preset.analyzerBrightness ?? 100,
      clockBrightness: preset.clockBrightness ?? 1,
    });
  };

  const handleApplyBuiltIn = async (preset) => {
    clearMessage();
    try {
      // sprawdzamy czy user już ma ten gotowiec zapisany
      const existing = presets.find((p) => p.name === preset.name);

      let targetId;
      if (existing) {
        targetId = existing.id;
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/presets`,
          {
            name: preset.name,
            color1: preset.color1,
            color2: preset.color2,
            color3: preset.color3,
            color4: preset.color4,
            color5: preset.color5,
          },
          { withCredentials: true },
        );
        targetId = res.data.data.preset.id;
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/presets/${targetId}/active`,
        {},
        { withCredentials: true },
      );

      setColors({
        color1: preset.color1,
        color2: preset.color2,
        color3: preset.color3,
        color4: preset.color4,
        color5: preset.color5,
      });
      setActivePresetId(targetId);
      setEditingId(null);
      fetchPresets();
    } catch (err) {
      setError("Nie udało się zastosować gotowej kombinacji.");
    }
  };

  const handleReset = () => {
    clearMessage();
    setColors(emptyColors);
    setPresetName("");
    setEditingId(null);
  };

  // generujemy 14 wartości częstotliwości do poglądu, podzielnych na 4 kolory
  const previewFrequencies = Array.from({ length: 14 }, (_, i) => {
    const base = [60, 80, 45, 90, 70, 85, 55, 75, 65, 50, 40, 60, 70, 55];
    return base[i] ?? 50;
  });

  if (loading) return <div className="p-8 text-white">Ładowanie...</div>;

  return (
    // głowny kontener
    <div className="p-8 text-white flex flex-col items-center pt-12 bg-black min-h-screen relative">
      <div className="fixed top-4 right z-50 w-full max-w-md px-10 flex flex-col items-center gap-2 pointer-events-none">
      {/* komunikat o błędzie */}
      {error && (
        <div className="flex items-center justify-between p-4 bg-red-500/95 backdrop-blur border border-red-500/30 text-white rounded-xl shadow-2xl pointer-events-auto animate-drop-down">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button onClick={clearMessage} className="text-white/60 hover:text-white p-1 cursor-pointer text-xs ml-4">
            ✕
          </button>
        </div>
      )}

      {/* komunikat o sukcesie */}
      {success && (
        <div className="flex items-center justify-between p-4 bg-emerald-500/95 backdrop-blur border border-emerald-500/30 text-white rounded-xl shadow-2xl pointer-events-auto animate-drop-down">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{success}</p>
          </div>
          <button onClick={clearMessage} className="text-white/60 hover:text-white p-1 cursor-pointer text-xs ml-4">
            ✕
          </button>
        </div>
      )}
      </div>

      <h1 className="text-5xl font-semibold mb-10 uppercase">Ustawienia</h1>

      {/* sztywny podglad analizatora dla lepszej wizualizacji */}
      <div className="w-full max-w-2xl flex flex-col gap-10 overflow-hidden">
        <div>
          <h2 className="text-xl font-semibold mb-4">Podgląd</h2>
          <SpectrumAnalyzerPreview
            colors={colors}
            frequencies={previewFrequencies}
          />
        </div>

        {/* tworzenie własnych kombinacji kolorów */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edytuj preset" : "Stwórz nowy preset"}
          </h2>

          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Nazwa presetu np. Neonowy"
            className="w-full p-3 mb-6 rounded-lg bg-white/5 border-2 border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff9f1c]"
          />

          {/* karty z kolorami */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {["color1", "color2", "color3", "color4", "color5", "clock"].map((key) => (
              <div
                key={key}
                onClick={() =>
                  setActiveColorKey(activeColorKey === key ? null : key)
                }
                className={`bg-white/5 border-2 rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-200 ${
                  activeColorKey === key
                    ? "border-orange-500 bg-white/10 shadow-[0_0_15px_rgba(255,159,28,0.05)]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-sm font-medium">
                    {colorLabels[key]}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {colors[key]}
                  </p>
                </div>

                {/* Pasek koloru */}
                <div
                  className="w-full h-10 rounded-lg border border-white/10"
                  style={{ backgroundColor: colors[key] }}
                />
              </div>
            ))}
          </div>

          {/* jeden wspólny colorpicker */}
          {activeColorKey && (
            <div className="mb-6 p-6 bg-white/5 border-2 border-orange-500 rounded-xl flex flex-col items-center gap-4 animate-fade-in">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>Edytujesz kolor dla:</span>
                <span className="font-semibold text-red-500 uppercase">
                  {colorLabels[activeColorKey]}
                </span>
              </div>

              <HexColorPicker
                color={colors[activeColorKey]}
                onChange={(color) =>
                  setColors((prev) => ({ ...prev, [activeColorKey]: color }))
                }
              />
            </div>
          )}

          {/* suwaki jasności */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="font-semibold text-md">Jasność analizatora</label>
                <span className="text-xs text-gray-400">{colors.analyzerBrightness}%</span>
              </div>
              <input
                type="range" min={0} max={100} step={1}
                value={colors.analyzerBrightness}
                onChange={(e) => setColors(prev => ({ ...prev, analyzerBrightness: Number(e.target.value) }))}
                className="w-full accent-orange-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="font-semibold text-md">Jasność zegara</label>
                <span className="text-xs text-gray-400">{colors.clockBrightness}%</span>
              </div>
              <input
                type="range" min={0} max={100} step={1}
                value={colors.clockBrightness}
                onChange={(e) => setColors(prev => ({ ...prev, clockBrightness: Number(e.target.value) }))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>

          {/* przyciski zapisu i resetu */}
          <div className="flex gap-3 mt-6">
            {editingId ? (
              <>
                <Button
                  onClick={() => handleUpdate(editingId)}
                  className="flex-1"
                >
                  Zapisz zmiany
                </Button>
                <Button onClick={handleReset} className="flex-1">
                  Anuluj
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSaveNew} className="flex-1">
                  Zapisz jako nowy preset
                </Button>
                <Button onClick={handleReset} className="flex-1">
                  Resetuj
                </Button>
              </>
            )}
          </div>
          
        </div>

        {/* gotowe kombinacje kolorów */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Gotowe kombinacje</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {builtInPresets.map((preset) => (
              <div
                key={preset.name}
                onClick={() => handleApplyBuiltIn(preset)}
                className="bg-white/5 border-2 border-white/10 rounded-xl p-4 cursor-pointer hover:border-orange-500 transition-all"
              >
                <p className="text-sm font-medium mb-3">{preset.name}</p>
                <div className="flex gap-1.5">
                  {[
                    preset.color1,
                    preset.color2,
                    preset.color3,
                    preset.color4,
                    preset.color5,
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 h-6 rounded"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* zapisane presety użytkownika */}
        {/* do zrobienia lepsze przejścia z kafelek + gotowe presety nie są podśiwtlane */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Twoje presety</h2>
          {presets.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Nie masz jeszcze żadnych zapisanych presetów.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 min-w-0 cursor-pointer">
              {presets.map((preset) => (
                <div
                onClick={() => !preset.isActive && handleActive(preset.id)}
                  key={preset.id}
                  className={`bg-white/5 border-2 rounded-xl p-4 transition-all hover:border-4 ${
                    preset.isActive
                      ? "border-orange-500 shadow-[0_0_12px_rgba(255,159,28,0.3)]"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium truncate min-w-0">{preset.name}</p>
                    {preset.isActive && (
                      <span className="text-xs text-orange-600">Aktywny</span>
                    )}
                  </div>
                  <div className="flex gap-1.5 mb-4">
                    {[
                      preset.color1,
                      preset.color2,
                      preset.color3,
                      preset.color4,
                      preset.color5,
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="flex-1 h-6 rounded"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 text-xs">
                    {/* {!preset.isActive && (
                      <button
                        onClick={() => handleActive(preset.id)}
                        className="flex-1 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        Aktywuj
                      </button>
                    )} */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditClick(preset)}}
                      className="flex-1 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={(e) => {e.stopPropagation(); handleDelete(preset.id)}}
                      className="flex-1 py-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Ustawienia;
