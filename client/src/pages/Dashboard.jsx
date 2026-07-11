import { Outlet } from 'react-router'
import Sidebar from '../components/layout/Sidebar.jsx'

// taki głowny dashboard, renderuje sidebar i outlet dla podstron dashboardu
export default function Dashboard() {
    return (
        <div className='min-h-screen bg-black text-[#c8c8d8] flex justify-center'>
            <Sidebar />
        </div>
    )
}