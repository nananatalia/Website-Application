import React from "react";

function Loading() {
  return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        
        {/* Spinner */}
        <div className='w-16 h-16 rounded-full border-4 border-gray-800 border-t-[#b30303] animate-spin' />
        
        {/* Tekst */}
        <p className='text-gray-400 text-sm tracking-widest uppercase'>Ładowanie...</p>
        
      </div>
    </div>
  );
}

export default Loading;
