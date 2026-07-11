import { useNavigate, NavLink, Outlet } from 'react-router'
import { useUser } from '../../context/AuthContext.jsx'
import Button from '../ui/Button.jsx'
import user3 from '../../assets/user3.png'
import soundbar from '../../assets/soundbar.svg'
import { use, useState } from 'react'

function Sidebar() {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
        await logout()
        navigate("/login")
    } catch (err) {
        console.log(err)
    }
  }

  const navItems = [
    { label: "Urządzenia", path: "/dashboard/urządzenia" },
    { label: "Ustawienia", path: "/dashboard/ustawienia" },
    { label: "Konto", path: "/dashboard/konto" }
  ]

  const SidebarPanel = () => (
    <div className='w-64 h-screen overflow-y-auto border-r border-white/40 p-4 flex flex-col relative bg-black select-none'>
        <div className='absolute top-0 left-0 w-full h-40 bg-[#5544b3]/40 rounded-b-full blur-2xl pointer-events-none z-0' />
        <div className='mt-4 mb-2 flex justify-center z-10 shrink-0'>
            <img src={soundbar} alt='Sound Bar Logo' className='w-38' />
        </div>

        <nav className='flex flex-col items-center mt-10 flex-1 gap-3 z-10'>
            {navItems.map(({label, path}) => (
                <NavLink
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={({isActive}) => 
                    `w-full text-center px-4 py-3 rounded-xl text-base font-bold tracking-[0.12em] uppercase transition-all duration-300 ${
                        isActive
                            ? 'bg-[#f0ede6] text-zinc-950 shadow-[0_4px_20px_rgba(240,237,230,0.15)] font-black'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5 border-2 border-transparent hover:border-white/30'
                    }`
                }
            >
                {label}
            </NavLink>
            ))}
        </nav>

        <div className='shrink-0 z-10'>
            <Button onClick={handleLogout} className='mt-6 mb-4 w-full'>
                Wyloguj
            </Button>

            <div className='border-t border-white/60 pt-6 w-full' />
            <div className='flex items-center gap-3 px-1 pb-2'>
                <img
                    src={user3}
                    alt='Zdjęcie profilowe'
                    className='w-[48px] h-[48px] rounded-full object-cover shrink-0 ring-2 ring-[#f0ede6] bg-zinc-900 shadow-md'
                />
                <div className='flex flex-col min-w-0'>
                    <h2 className='text-xs font-bold text-zinc-200 truncate tracking-wide'>
                        {user?.name ?? 'Użytkownik'}
                    </h2>
                    <p className='text-xs text-zinc-500 font-medium truncate mt-0.5'>
                        {user?.email ?? 'jankowalski@example.com'}
                    </p>
                </div>
            </div>
        </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-black flex overflow-hidden'>

        <div className='hidden md:block w-64 shrink-0'>
            {/* fixed żeby nie scrollował razem z treścią */}
            <div className='fixed left-0 top-0 h-screen'>
                <SidebarPanel />
            </div>
        </div>

            {/* Hamburger */}
            <button
                className='md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-900 text-[#f0ede6] border border-white/10 shadow-lg'
                onClick={() => setIsOpen(true)}
                aria-label='Otwórz menu'
            >
                <svg className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 6h16M4 12h16M4 18h16'
                    />
                </svg>
            </button>

            {/* mobilne (półprzezroczyste tło */}
            {isOpen && (
                <div className='md:hidden fixed inset-0 bg-black/60 z-40'
                    onClick={() => setIsOpen(false)}
                />
            )}
            {/* szuflada */}
            <div className={`md:hidden fixed left-0 top-0 h-screen z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <SidebarPanel />
            </div>

            {/* głowna treść */}
            <main className='flex-1 min-w-0 p-5 pt-16 md:pt-5 text-white flex justify-center overflow-y-auto'>
                <Outlet />
            </main>    

    </div>
  )
}

export default Sidebar