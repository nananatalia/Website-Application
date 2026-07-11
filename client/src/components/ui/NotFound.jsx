import { Link } from 'react-router';
import Background from '../layout/Background';


export default function NotFound() {
    return (
        <div className='min-h-screen bg-black flex items-center justify-center'>
            <div className="flex flex-col items-center text-sm max-md:px-4 py-20">
                <h1 className="text-4xl md:text-5xl mb-8 font-bold bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
                    404 Not Found
                </h1>
                <p className="md:text-xl text-gray-400 max-w-lg text-center">
                    Strona której szukasz nie istnieje lub została przeniesiona. Sprawdź adres URL lub wróć do strony głównej.
                </p>
                 <Link to="/" className="group flex items-center gap-1 px-7 py-2.5 rounded-full mt-10 font-medium active:scale-95 transition-all text-[#ff9f1c] border-2 border-[#ff9f1c] hover:bg-[#ff9f1c] hover:text-white">
                    Wróć do strony głównej
                </Link>
            </div>
        </div>
    );
};