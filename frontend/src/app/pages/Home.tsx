import { useEffect } from "react";
import { CabinsSection } from "../components/CabinsSection";
import { Link, useLocation } from "react-router-dom";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { LocationSection } from "../components/LocationSection";

/**
 * Componente de la Página de Inicio
 * Renderiza la sección principal (hero) y sirve como el punto de entrada principal.
 */
export function Home() {
  const location = useLocation();

  // Handle scroll-to when navigating from another page (e.g., /reservas -> /#cabins)
  useEffect(() => {
    const scrollTo = (location.state as any)?.scrollTo;
    if (scrollTo) {
      // Small delay to let the page render first
      setTimeout(() => {
        const el = document.getElementById(scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      // Clean the state so it doesn't scroll again on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  return (
    <div>
      <div className="relative w-full h-[80vh] min-h-[600px] flex flex-col items-center justify-center border-b border-stone-800 overflow-hidden">
        {/* Background Video: YouTube for Desktop, Native HTML5 for Mobile */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-stone-900">
          
          {/* YouTube Video - Visible on all screens */}
          <iframe
            src="https://www.youtube.com/embed/cTxwBo-iqfI?autoplay=1&mute=1&loop=1&playlist=cTxwBo-iqfI&controls=0&disablekb=1&modestbranding=1&playsinline=1&vq=hd1080"
            title="Hero Video"
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 w-[250vw] h-[140.625vw] md:w-[100vw] md:h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          ></iframe>
        </div>
        
        {/* Dark overlay specifically needed to keep the white text readable against the video */}
        <div className="absolute inset-0 bg-stone-900/40 z-10" />

        <div className="relative z-20 text-center px-4 flex flex-col items-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl text-white font-serif font-bold mb-6 drop-shadow-2xl">
            Bienvenidos a Glamping Los Bosques
          </h1>
          <p className="text-stone-100 text-lg md:text-2xl text-center mb-10 drop-shadow-xl font-medium">
            Escapa a la naturaleza sin sacrificar el lujo. Disfruta de una experiencia única de glamping en el corazón del bosque.
          </p>
          <a href="#cabins" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold hover:bg-emerald-700 hover:border-emerald-700 transition-all shadow-xl hover:scale-105">
            Explorar alojamiento
          </a>
        </div>
      </div>

      <CabinsSection />

      <LocationSection />

      <TestimonialsSection />

      <section className="py-24 px-4 bg-stone-100 text-center border-t border-stone-200">
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-6">¿Listo para vivir la experiencia?</h2>
        <p className="text-stone-600 mb-8 max-w-2xl mx-auto text-lg">
          Reserva tu estadía con nosotros y prepárate para desconectarte de la rutina en un entorno de lujo y tranquilidad.
        </p>
        <Link to="/reservas" className="inline-block px-8 py-4 bg-emerald-700 text-white rounded-full font-bold hover:bg-emerald-600 transition-all shadow-xl hover:scale-105">
          Ir a Reservar
        </Link>
      </section>
    </div>
  );
}
