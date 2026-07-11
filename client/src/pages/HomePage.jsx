import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button';
import Background from '../components/layout/Background';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black text-[#c8c8d8] flex items-center justify-center px-8 lg:px-20 py-16 overflow-hidden">
      <Background />
      
      {/* Subtelna linia horyzontu w tle dzieląca ekran */}
      <div className="absolute top-1/2 left-0 w-full h-1px bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      {/* Główna siatka dwukolumnowa */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 w-full max-w-6xl items-stretch">
        
        {/* LEWA KOLUMNA: Hasło + Przycisk akcji (Płynny, zgrany blok) */}
        <div className="lg:col-span-6 flex flex-col justify-between items-start text-left py-2">
          <div>            
            <h1 className="font-black text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] tracking-[-0.04em] text-[#f0ede6] uppercase">
              Dźwięk <br />
              ma kształt.<br />
              <span className="text-zinc-500">Zobacz go.</span>
            </h1>
          </div>
        </div>

        {/* PRAWA KOLUMNA: Opisy i szczegóły techniczne */}
        <div className="lg:col-span-6 flex flex-col gap-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-10 lg:pt-2 lg:pl-16 justify-between">
          
          <div className="space-y-8">
            {/* Sekcja 1: Główna funkcja */}
            <div className="space-y-3">
              <h2 className="font-bold text-xs uppercase tracking-[0.15em] font-mono text-orange-500/90">
                // Analizator Widma
              </h2>
              <p className="text-[#f0ede6]/70 text-base leading-relaxed font-light">
                Witaj w naszej internetowej aplikacji!
                Modyfikuj tak jak chcesz - customizacja kolorów i ustawień pozwala dopasować urządzenie do Twojego stylu!
              </p>
            </div>
          </div>
          <div className="mb-8 flex flex-col gap-6 w-full">
            <div className="w-full flex justify-start">
              <Button
                onClick={() => navigate('/login')}
                className="px-6 py-4 mb-8 mt-1 w-full sm:w-auto text-center"
              >
                Zaczynamy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}