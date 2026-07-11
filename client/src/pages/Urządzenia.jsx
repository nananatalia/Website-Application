import React from 'react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import SpectrumAnalyzer from '../components/ui/SpectrumAnalyzer';

const socket = io(import.meta.env.VITE_SOCKET_URL)

// TODO: dodać obsługę błędów połączenia i rozłączenia, np. wyświetlać komunikat w UI
// funkcja 
function Urządzenia() {
  const [frequencies, setFrequencies] = useState(Array(14).fill(20));
  const [connected, setConnected] = useState(false);
  const [deviceData, setDeviceData] = useState({
    wifi: { signal: -65 },
    packetsReceived: 0,
    version: '1.0.0'
  })

  useEffect(() => {
    socket.on("connect", () => setConnected(true))
    socket.on("disconnect", () => setConnected(false))
    socket.on("frequencies", (data) => {
      if (Array.isArray(data)) {
        setFrequencies(data);
      } else if (data.frequencies && Array.isArray(data.frequencies)) {
        setFrequencies(data.frequencies)
        setDeviceData(prev => ({
          wifi: data.wifi ?? prev.wifi,
          packetsReceived: data.packetsReceived ?? prev.packetsReceived,
          version: data.version ?? prev.version
        }))
      }
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("frequencies")
    }
  }, [])

  const getWifiTextColor = (signal) => {
    if (signal >= -50) return "text-green-500";
    if (signal >= -60) return "text-yellow-500";
    if (signal >= -70) return "text-orange-500";
    return "text-red-500";
  }

  const getWifiColorQuality = (signal) => {
    if (signal >= -50) return "Doskonała";
    if (signal >= -60) return "Dobra";
    if (signal >= -70) return "Słaba";
    return "Bardzo słaba";
  }

  return (
    <div className='p-8 text-white flex flex-col items-center'>
      <h1 className='text-5xl font-semibold mb-8 uppercase'>Analizator Widma</h1>

      {/* Informacje */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 w-full max-w-3xl'>
        <div className='bg-white/5 border-2 border-white/10 rounded-xl p-4 flex flex-col gap-2'>
        <p className='text-gray-400 text-sm'>
          Status połączenia
        </p>
        <div className='flex items-center gap-2'>
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <p className={`font-semibold ${connected ? 'text-green-500' : 'text-red-500'}`}>
            {connected ? "Połączono" : "Rozłączono"}
          </p>
        </div>
      </div>

      <div className='bg-white/5 border-2 border-white/10 rounded-xl p-4 flex flex-col gap-2'>
        <p className='text-gray-400 text-sm'>Jakość sygnału WiFi</p>
        <p className={`font-semibold ${getWifiTextColor(deviceData.wifi.signal)}`}>
          {getWifiColorQuality(deviceData.wifi.signal)}
        </p>
        <p className='text-xs text-gray-500'>{deviceData.wifi.signal} dBm</p>
      </div>

      <div className='bg-white/5 border-2 border-white/10 rounded-xl p-4 flex flex-col gap-2'>
        <p className='text-gray-400 text-sm'>Liczba odebranych pakietów</p>
        <p className='font-semibold text-white text-xl'>{deviceData.packetsReceived.toLocaleString()}</p>
      </div>

      <div className='bg-white/5 border-2 border-white/10 rounded-xl p-4 flex flex-col gap-2'>
        <p className='text-gray-400 text-sm'>Wersja software</p>
        <p className='font-semibold text-white'>{deviceData.version}</p>
      </div>

      </div>

      <SpectrumAnalyzer frequencies={frequencies} />

    </div>    
  )
}

export default Urządzenia;