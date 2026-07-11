import React, { useEffect, useRef } from 'react'


// Kolory neonowe dla słupków (od najciemniejszego do najjaśniejszego)
const COLORS_RGB = [
  [55, 138, 221],
  [88, 114, 216],
  [120, 96, 206],
  [152, 80, 196],
  [176, 68, 175],
  [196, 64, 150],
  [212, 83, 126],
  [220, 84, 105],
  [226, 85, 136]
];

const ROZMIAR_KLOCKA = 28
const ODSTEP = 5
const POZIOM_TOTAL = 9

function Background() {
  const canvasRef = useRef(null);

  // animacja tła - słupki falujące w rytm muzyki
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animFrame;
    let bars = [];

    // ustawia rozmiar canvy i ilość słupków w zależności od szerokości ekranu
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const colWidth = ROZMIAR_KLOCKA + ODSTEP;
      const cols = Math.ceil(canvas.width / colWidth) + 1;
      if (bars.length < cols) {
        for (let i = bars.length; i < cols; i++)
          bars.push({ x: i * colWidth, duration: 700 + Math.random() * 800, phase: Math.random() });
      } else if (bars.length > cols) {
        bars = bars.slice(0, cols);
      }
      bars.forEach((bar, i) => { bar.x = i * colWidth; });
    };

    // chuj wie jak to działa, ale działa (funkcja rysująca animacje)
    const draw = (ts) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bars.forEach(bar => {
        const level = Math.abs(Math.sin((ts / bar.duration + bar.phase) * Math.PI));
        const lit = 1 + level * (POZIOM_TOTAL - 1);
        for (let i = 0; i < POZIOM_TOTAL; i++) {
          const rgb = COLORS_RGB[i];
          ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${i < lit ? 0.7 : 0})`;
          const y = canvas.height - (i + 1) * ROZMIAR_KLOCKA - i * ODSTEP;
          ctx.beginPath();
          ctx.roundRect(bar.x, y, ROZMIAR_KLOCKA, ROZMIAR_KLOCKA, 4);
          ctx.fill();
        }
      });
      animFrame = requestAnimationFrame(draw);
    };

    setup();
    animFrame = requestAnimationFrame(draw);
    window.addEventListener('resize', setup);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', setup);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 z-1 pointer-events-none bg-linear-to-t from-[#111122]/30 via-[#111122]/55 to-[#111122]/92" />
      <div className="fixed inset-0 z-2 pointer-events-none [background:radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
      <div className="fixed inset-0 z-3 pointer-events-none opacity-[0.02] [background-image:repeatinglinear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_3px)]" />
    </>
  )
}

export default Background