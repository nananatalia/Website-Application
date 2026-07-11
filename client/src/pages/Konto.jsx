import React from 'react'
import { useUser } from '../context/AuthContext.jsx';

function Konto() {
  const { user } = useUser();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: "long",
      day: "numeric"
    }) 
  } 

  return (
    <div className='p-8 text-white flex flex-col'>
            <h1 className='text-5xl items-center font-semibold mb-10 uppercase'>Informacje o koncie</h1>

            <div className='max-w-lg bg-black border-3 border-orange-500 rounded-2xl p-8 flex flex-col gap-4'>
                
                <div className='flex flex-col gap-1'>
                    <p className='text-gray-400 text-sm'>Nazwa użytkownika</p>
                    <p className='text-white text-lg'>{user?.name}</p>
                </div>

                <div className='h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent' />

                <div className='flex flex-col gap-1'>
                    <p className='text-gray-400 text-sm'>Adres e-mail</p>
                    <p className='text-white text-lg'>{user?.email}</p>
                </div>

                <div className='h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent' />

                <div className='flex flex-col gap-1'>
                    <p className='text-gray-400 text-sm'>Data założenia konta</p>
                    <p className='text-white text-lg'>{user?.createdAt ? formatDate(user.createdAt) : '-'}</p>
                </div>

                <div className='h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent' />

                <div className='flex flex-col gap-1'>
                    <p className='text-gray-400 text-sm'>Ostatnia aktualizacja</p>
                    <p className='text-white text-lg'>{user?.updatedAt ? formatDate(user.updatedAt) : '-'}</p>
                </div>

                <div className='h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent' />

                <div className='flex flex-col gap-1'>
                    <p className='text-gray-400 text-sm'>Bluetooth</p>
                    <p className='text-white text-lg'>{user?.bluetooth ? 'Tak' : 'Nie'}</p>
                </div>

                <div className='h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent' />

                <div className='flex flex-col gap-1'>
                    <p className='text-gray-400 text-sm'>Połączone urządzenia</p>
                    <p className='text-white text-lg'>{user?.devices?.length ?? 0}</p>
                </div>
                
            </div>
        </div>
  )
}

export default Konto