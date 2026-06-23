import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Instagram, MessageCircle, Mail } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import logoImg from "../../../logo/logo.jpeg";
import { ChatBot } from "./ChatBot";
import { TermsModal } from "./TermsModal";


/**
 * Contenedor principal del diseño de la aplicación.
 * Proporciona el encabezado de navegación fijo y el pie de página en todas las rutas.
 */
export function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigate to home and scroll to section if on a different page
  const handleSectionClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800 bg-stone-50">
      <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img src={logoImg} alt="Logo Glamping Los Bosques" className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover bg-white ring-2 ring-emerald-700/20 group-hover:ring-emerald-700/50 transition-all shadow-sm" />
              <span className="text-xl font-bold tracking-tight text-stone-900">Glamping Los Bosques</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-4 lg:gap-6 font-medium text-stone-600">
              <a href="/#cabins" className="hover:text-emerald-700 transition-colors whitespace-nowrap">Cabañas</a>
              <a href="/#promociones" className="hover:text-emerald-700 transition-colors flex items-center gap-1 whitespace-nowrap">Promociones</a>
              <a href="/#location" className="hover:text-emerald-700 transition-colors whitespace-nowrap">Ubicación</a>
              <Link to="/reservas" className="hover:text-emerald-700 transition-colors whitespace-nowrap">Reservas</Link>
              <a href="/#testimonials" className="hover:text-emerald-700 transition-colors whitespace-nowrap">Reseñas</a>
            </nav>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link to="/reservas" className="hidden md:flex px-5 py-2.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors shadow-sm font-semibold whitespace-nowrap">
              Reservar Ahora
            </Link>
            <button className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 w-full bg-white shadow-lg border-b border-stone-200 z-40 md:hidden flex flex-col p-4 gap-4 text-center font-medium"
          >
            <a href="/#cabins" onClick={(e) => handleSectionClick(e, 'cabins')} className="py-3 text-stone-700 hover:bg-stone-50 rounded-lg">Cabañas</a>
            <a href="/#promociones" onClick={(e) => handleSectionClick(e, 'promociones')} className="py-3 text-stone-700 hover:bg-stone-50 rounded-lg">Promociones</a>
            <a href="/#location" onClick={(e) => handleSectionClick(e, 'location')} className="py-3 text-stone-700 hover:bg-stone-50 rounded-lg">Ubicación</a>
            <Link to="/reservas" onClick={() => setIsMenuOpen(false)} className="py-3 text-stone-700 hover:bg-stone-50 rounded-lg">Reservas</Link>
            <a href="/#testimonials" onClick={(e) => handleSectionClick(e, 'testimonials')} className="py-3 text-stone-700 hover:bg-stone-50 rounded-lg">Reseñas</a>
            <Link to="/reservas" onClick={() => setIsMenuOpen(false)} className="py-3 mt-2 bg-emerald-700 text-white rounded-lg font-semibold">Reservar Ahora</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full pt-20">
        <Outlet />
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3 text-white">
              <img 
                src={logoImg} 
                alt="Logo Glamping Los Bosques" 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white object-cover ring-2 ring-emerald-500/50 shadow-md"
              />
              <span className="text-xl font-bold">Glamping Los Bosques</span>
            </div>
            <p className="max-w-xs text-stone-400 text-sm">
              Una experiencia única de desconexión en medio de la naturaleza con todas las comodidades.
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center md:items-start">
            <h4 className="text-white font-semibold mb-2">Contacto</h4>
            <a href="https://wa.me/573103599065" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-sm">WhatsApp: 3103599065</span>
            </a>
            <a href="https://www.instagram.com/glampinglosbosques/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors">
              <Instagram className="w-5 h-5 text-emerald-500" />
              <span className="text-sm">Instagram: @glampinglosbosques</span>
            </a>
            <a href="https://www.tiktok.com/@glampinglosbosques" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors">
              <svg 
                className="w-4 h-4 fill-current text-emerald-500" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a8.498 8.498 0 01-1.87-1.44v7.71a8.49 8.49 0 01-1.3 4.54 8.5 8.5 0 11-5.71-8.21v4.03a4.469 4.469 0 00-2.76 4.18 4.5 4.5 0 109.01 0V0h-3.15z"/>
              </svg>
              <span className="text-sm">TikTok: glampinglosbosques</span>
            </a>
            <a href="mailto:glampinglosbosques@gmail.com" className="text-sm flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors">
              <Mail className="w-5 h-5 text-emerald-500" />
              <span>glampinglosbosques@gmail.com</span>
            </a>
          </div>
          <div className="flex flex-col gap-3 items-center md:items-start">
            <h4 className="text-white font-semibold mb-2">Enlaces</h4>
            <a href="#cabins" className="text-sm hover:text-white transition-colors text-center md:text-left">Nuestras Cabañas</a>
            <Link to="/reservas" className="text-sm hover:text-white transition-colors text-center md:text-left">Reserva tu estadía</Link>
            <button
              onClick={() => setIsTermsOpen(true)}
              className="text-sm hover:text-white transition-colors text-center md:text-left"
            >
              Términos y Condiciones
            </button>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-sm">
          <p>© {new Date().getFullYear()} Glamping Los Bosques. Todos los derechos reservados.</p>
        </div>
      </footer>
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <ChatBot />
    </div>
  );
}
