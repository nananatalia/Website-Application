export default function Button({ children, disabled, onClick, type = "button", className = "" }) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
                relative px-8 py-3.5 rounded-xl overflow-hidden
                font-bold text-[0.8rem] tracking-[0.15em] uppercase text-zinc-950
              bg-[#f0ede6] border border-[#f0ede6]/40 
                shadow-[0_4px_20px_rgba(240,237,230,0.15)]         
                transition-all duration-300 ease-out cursor-pointer        
                hover:-translate-y-0.5 hover:bg-white hover:border-white hover:text-orange-600        
                active:translate-y-0 active:scale-[0.98] 
                disabled:opacity-40 disabled:pointer-events-none disabled:transform-none 
                ${className}`}
        >
            {/* Subtelny szklany połysk na przycisku */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none" />
      
             {/* Tekst/Zawartość przycisku */}
            <span className="relative z-10 flex items-center gap-2 justify-center">
                {children}
            </span>
        </button>
    )
}