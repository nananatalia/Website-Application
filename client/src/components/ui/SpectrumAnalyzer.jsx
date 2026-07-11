import React, { useEffect, useRef, useState } from 'react';

export default function SpectrumAnalyzer({ frequencies, colors }) {
  const canvasRef = useRef(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const animationRef = useRef(null);

  // PARAMETRY WIZUALNE (Dopasowane do proporcji 105x35 cm)
  const COLUMNS = 24//frequencies.length;       Liczba słupków w poziomie
  const ROWS = 16;          // Liczba segmentów (kostek) w pionie
  const DECAY = 0.93;       // Jak szybko opadają słupki (0.9 - szybko, 0.98 - bardzo wolno)
  const PEAK_DECAY = 0.98;  // Jak szybko opada zawisający punkt
  const PEAK_HOLD_TIME = 10; // Ile klatek punkt czeka przed opadnięciem (~400ms) - 25 wstępnie

  // Stan fizyki słupków (przechowywany w refach, aby nie triggerować re-renderów Reacta przy 60 FPS)
  const valuesRef = useRef(new Array(COLUMNS).fill(0));
  const peaksRef = useRef(new Array(COLUMNS).fill(0));
  const peakHoldsRef = useRef(new Array(COLUMNS).fill(0));
  //const frequenciesRef = useRef(frequencies)

  // NA SZTYWNO!!!!
  // Generator sztucznego sygnału (symulacja muzyki: bas, środek, sopran)
  const generateSimulatedData = (tick) => {
    const data = [];
    for (let i = 0; i < COLUMNS; i++) {
      let target = 0;
      
      // Podział na pasma dla realizmu
      if (i < COLUMNS * 0.25) {
        // Basy (mocne uderzenia)
        target = Math.sin(tick * 0.15) * Math.cos(tick * 0.05) * 0.8 + 0.2;
        if (tick % 20 < 4) target += 0.4; // uderzenie stopy
      } else if (i < COLUMNS * 0.75) {
        // Średnie tony (wokal, gitary - bardziej ciągłe)
        target = Math.sin(tick * 0.08 + i) * 0.4 + 0.4;
        target += Math.cos(tick * 0.2 - i) * 0.2;
      } else {
        // Wysokie tony (szybkie, szarpane)
        target = Math.random() * 0.4 + Math.sin(tick * 0.3 + i) * 0.3;
      }

      // Losowe drobne zakłócenia, żeby sygnał "żył"
      target += (Math.random() - 0.5) * 0.1;
      
      // Ograniczenie wartości do przedziału 0-1
      data.push(Math.max(0, Math.min(1, target)));
    }
    return data;
  };

  //WERSJA Z PRAWDZIWYMI DANYMI
  //Zamiast generateSimulatedData, korzysta z propsa `frequencies` przekazywanego z Urządzenia.jsx, znormalizowanego do 0-1
  
  // const frequenciesRef = useRef(frequencies)

  // useEffect(() => {
  //   frequenciesRef.current = frequencies
  // }, [frequencies])

    // useEffect(() => {
    // const canvas = canvasRef.current
    // if (!canvas) return
    // const ctx = canvas.getContext('2d')
    // let tick = 0

    
    // const render = () => {
    //   tick++
    // const newData = frequenciesRef.current.map(v => Math.max(0, Math.min(1, v / 100)))

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let tick = 0;

    const render = () => {
      tick++;
      
      // 1. Pobranie danych (symulacja lub wyciszenie)
      const newData = isSimulating ? generateSimulatedData(tick) : new Array(COLUMNS).fill(0);

      // 2. Aktualizacja fizyki (Atak, Opadanie, Peak Hold)
      for (let i = 0; i < COLUMNS; i++) {
        // Słupek: jeśli nowy sygnał jest wyższy -> natychmiastowy skok (Atak). Jeśli niższy -> płynne opadanie (Decay)
        if (newData[i] > valuesRef.current[i]) {
          valuesRef.current[i] = newData[i];
        } else {
          valuesRef.current[i] *= DECAY;
        }

        // Logika zawisającego punktu (Peak)
        if (valuesRef.current[i] >= peaksRef.current[i]) {
          peaksRef.current[i] = valuesRef.current[i];
          peakHoldsRef.current[i] = PEAK_HOLD_TIME; // reset czasu zawieszenia
        } else {
          if (peakHoldsRef.current[i] > 0) {
            peakHoldsRef.current[i]--; // odliczanie czasu w powietrzu
          } else {
            peaksRef.current[i] *= PEAK_DECAY; // powolny spadek po czasie zawieszenia
          }
        }
      }

      // 3. Rysowanie na Canvas
      // Czyszczenie ekranu (bardzo ciemny grafit, z którego przebija siatka)
      ctx.fillStyle = '#111114'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const colWidth = canvas.width / COLUMNS;
      const rowHeight = canvas.height / ROWS;
      
      // Marginesy/Przerwy (Gaps) – klucz do efektu "segmentów"
      const colGap = 4; // przerwa między słupkami w poziomie
      const rowGap = 2; // przerwa między kostkami w pionie

      for (let c = 0; c < COLUMNS; c++) {
        const currentRowsActive = Math.round(valuesRef.current[c] * ROWS);
        const peakRowIndex = Math.round(peaksRef.current[c] * ROWS);

        // Zmiana: Rysujemy KAŻDY wiersz od 0 do ROWS, aby stworzyć stałą siatkę tła
        for (let r = 0; r < ROWS; r++) {
          const isFilled = r < currentRowsActive;
          const isPeak = r === peakRowIndex - 1 && peakRowIndex > 0;

          // Obliczanie pozycji x, y oraz wymiarów pojedynczej kostki
          const x = c * colWidth + colGap / 2;
          const y = canvas.height - (r + 1) * rowHeight + rowGap / 2;
          const w = colWidth - colGap;
          const h = rowHeight - rowGap;

          if (isFilled || isPeak) {
            // Mapowanie kolorów z Twojego kodu
            if (r < ROWS * 0.6) {
              ctx.fillStyle = isPeak ? '#fff' : '#3e96d6'; // niebieskawy
            } else if (r < ROWS * 0.85) {
              ctx.fillStyle = isPeak ? '#9600FF' : '#bf98f2'; // fiolety
            } else {
              ctx.fillStyle = isPeak ? '#dc2626' : '#ff98ff'; // róż/czerwień
            }
            ctx.fillRect(x, y, w, h);
          } else {
            // NOWOŚĆ: Delikatne, przezroczyste tło dla nieaktywnych kostek siatki
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'; 
            ctx.fillRect(x, y, w, h);
          }
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSimulating]);

  return (
    <div className="flex flex-col items-center">

      {/* Kontener odwzorowujący fizyczną obudowę urządzenia */}
      <div className="relative bg-zinc-900 p-4 rounded-xl border border-zinc-600 shadow-2xl">
        {/* Aluminiowa/Srebrna cienka ramka wewnętrzna */}
        <div className="border border-zinc-950 rounded bg-[rgba(61,61,61,0.363)] p-2">
          <canvas
            ref={canvasRef}
            width={1050}
            height={350}
            className="w-full h-auto max-w-full block aspect-[105/35]"
          />
        </div>
      </div>

      {/* Panel sterowania */}
      <div className="mt-8">
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm tracking-wide uppercase transition-colors duration-200 ${
            isSimulating
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isSimulating ? 'Zatrzymaj symulację' : 'Uruchom symulację'}
        </button>
      </div>
    </div>
  );
}

// give_me_a_joke = () => {
//   const jokes = [
//     "Dlaczego programiści nie lubią natury? Bo ma za dużo bugów!",
//     "Jak nazywa się programista, który lubi kawę? Java Developer!",
//     "Dlaczego komputerowi jest zimno? Bo ma otwarte okna!",
//     "Co mówi programista, gdy jest głodny? 'Chcę zjeść coś lekkiego, może JSON?'",
//     "Dlaczego programiści nie mogą się dogadać? Bo mają różne języki!",
//   ];
//   return jokes[Math.floor(Math.random() * jokes.length)];
// }