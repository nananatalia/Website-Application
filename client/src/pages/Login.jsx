import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useUser } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import axios from 'axios';
import { set } from 'react-hook-form';
import Background from '../components/layout/Background.jsx';

function Login() {
    const [state, setState] = useState("Sign In")
    const { login, isSubmitting } = useUser();
    const navigate = useNavigate();

    // stan formularza
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // automatyczne czyszczenie pól
    useEffect(() => {
        setError("");
        setSuccess("");
        setName("");
        //setEmail(""); 
        setPassword("");
        setConfirmPassword("");
    }, [state]);

    // obsługa submitu
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("");
        setSuccess("");

        if (state === "Sign In") {
            try {
                await login({ email, password })
                navigate("/dashboard"); // Przekierowanie po udanym logowaniu
            } catch (err) {
                setError("Błąd logowania. Sprawdź email i hasło.")
            }
        } else {
            if (password !== confirmPassword) {
                setError("Hasła nie są zgodne.");
                return;
            }
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password, confirmPassword })
                await login({ email, password }) // Logowanie po rejestracji
                navigate("/dashboard"); // Przekierowanie po udanym logowaniu
                //setSuccess("Zarejestrowano pomyślnie! Teraz możesz się zalogować.")
                //setError("");
                //setState("Sign In");
            } catch (err) {
                setError("Błąd rejestracji. Upewnij się, że email jest poprawny i hasło ma co najmniej 6 znaków.")
            }
        }
    }

    return (
        <div className='min-h-screen bg-black text-[#f0ede6] font-extrabold flex items-center justify-center p-4'>
            <Background />
            <form onSubmit={handleSubmit} className='relative bg-[#111122] p-5 sm:p-8 rounded-lg w-full max-w-125 shadow-[0_10px_25px_rgba(255,255,255,0.414)]
                flex flex-col overflow-hidden fixed inset-0 z-2 [background:radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_30%,rgba(0,0,0,0.65)_100%)]'>
                <h2 className='text-3xl sm:text-5xl text-center text-zinc-300 mb-4 transition-all'>
                    {state === "Sign In" ? "Zaloguj się" : "Zarejestruj się"}
                </h2>

                {/* Nazwa użytkownika widoczna tylko przy rejestracji */}
                {state === "Sign Up" && (
                    <div className='flex flex-col'>
                        <label className='py-2 text-[16px] font-light mt-1 mb-0.5'>
                            Nazwa użytkownika
                        </label>
                        <input type='text'
                            className='p-2.5 mt-0.5 border-4 border-[#e1e5e9] rounded-[5px]
                            text-base focus:outline-none focus:border-orange-600'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                    </div>
                )}

                {/* Adres email - wodoczny ZAWSZE */}                
                <div className='flex flex-col'>
                    <label className='py-2 text-[16px] font-light mt-1 mb-0.5'>
                        Adres e-mail
                    </label>
                    <input type='email'
                        className='p-2.5 mt-0.5 border-4 border-[#e1e5e9] rounded-[5px]
                        text-base focus:outline-none focus:border-orange-600'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                </div>
                

                {/* Hasło */}
                <div className='flex flex-col'>
                    <label className='py-2 text-[16px] font-light mt-1 mb-0.5'>
                        Hasło
                    </label>
                    <input type='password'
                    className='p-2.5 mt-0.5 border-4 border-[#e1e5e9] rounded-[5px]
                    text-base focus:outline-none focus:border-orange-600'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Potwierdzenie hasła - tylko przy rejestracji */}
                {state === "Sign Up" && (
                    <div className='flex flex-col'>
                        <label className='py-2 text-[16px] font-light mt-1 mb-0.5'>
                            Potwierdź hasło
                        </label>
                        <input type='password'
                        className='p-2.5 mt-0.5 border-4 border-[#e1e5e9] rounded-[5px]
                        text-base focus:outline-none focus:border-orange-600'
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}

                 {error && (
                    <p className='text-red-600 text-sm mt-3 text-center'>{error}</p>
                )}

                {success && (
                    <p className='text-green-500 text-sm mt-3 text-center'>{success}</p>
                )}

                <Button
                    type='submit'
                    disabled={isSubmitting} 
                    className="mt-6">
                    {isSubmitting ? "Wysyłanie..." : "Wyślij" }
                </Button>

                {state === "Sign Up" ? (
                    <p className='text-center text-base mt-4 font-normal'>
                        Masz już konto? <span onClick={() => setState("Sign In")} className='text-orange-600 cursor-pointer'>Zaloguj się</span>
                    </p>
                ) : (
                    <p className='text-center text-base mt-4 font-normal'>
                        Nie masz konta? <span onClick={() => setState("Sign Up")} className='text-orange-600 cursor-pointer'>Zarejestruj się</span>
                    </p>
                )}
            </form>
        </div>
    )
}

export default Login