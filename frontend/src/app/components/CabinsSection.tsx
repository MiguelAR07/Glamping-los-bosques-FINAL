import { useState, useEffect, useRef } from "react";
import { Trees, Wifi, Tv, Coffee, Flame, CheckCircle2, Car, Utensils, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Importamos el tipo y la función de la API
import { Cabin } from "../types.ts";
import { getCabins } from "../api.ts";

/**
 * Componente de Icono optimizado
 */
const FeatureIcon = ({ feature }: { feature: string }) => {
  const f = feature.toLowerCase();
  
  let Icon = CheckCircle2;
  if (f.includes('jacuzzi')) Icon = Coffee;
  else if (f.includes('wifi')) Icon = Wifi;
  else if (f.includes('tv')) Icon = Tv;
  else if (f.includes('fogata') || f.includes('fuego')) Icon = Flame;
  else if (f.includes('verde') || f.includes('catamaran')) Icon = Trees;
  else if (f.includes('parqueadero')) Icon = Car;
  else if (f.includes('bbq')) Icon = Utensils;

  return <Icon className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
};

interface CabinCardProps {
  cabin: Cabin;
  index?: number;
  showDescription?: boolean;
  showFeatures?: boolean;
  maxFeatures?: number;
}

/**
 * Tarjeta de Cabaña Altamente Reutilizable y Proporcionada
 */
export const CabinCard = ({ 
  cabin, 
  index = 0, 
  showDescription = true, 
  showFeatures = true,
  maxFeatures = 4
}: CabinCardProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const images = cabin.img_url || [];

  const scroll = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.preventDefault(); // Evita comportamientos extraños si la card está dentro de un link
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-stone-100 flex flex-col group transition-all duration-300 h-full w-full"
    >
      {/* Carrusel de Imágenes Proporcionado */}
      <div className="w-full aspect-[16/10] relative overflow-hidden bg-stone-100 group/carousel">
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => scroll(e, 'left')} 
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => scroll(e, 'right')} 
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-full">
          {images.map((img: string, i: number) => (
            <div key={i} className="flex-none w-full h-full snap-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-stone-900/5 z-[1] pointer-events-none" />
              {images.length > 1 && (
                <div className="absolute top-2.5 right-2.5 z-[2] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[10px] font-medium border border-white/10">
                  {i + 1} / {images.length}
                </div>
              )}
              <img 
                src={img} 
                alt={`${cabin.nombre} - Vista ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-stone-900 mb-3">{cabin.nombre}</h3>
        <p className="text-stone-600 mb-6 leading-relaxed flex-1 text-sm md:text-base">
          {cabin.descripcion}
        </p>
        
        <div className="mb-6">
          <h4 className="text-xs md:text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Comodidades</h4>
          <ul className="grid grid-cols-2 gap-y-3 gap-x-2">
            {cabin.features.map((feature: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-stone-700 text-sm font-medium">
                <FeatureIcon feature={feature} />
                <span className="truncate">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-6 border-t border-stone-100">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="block text-xs text-stone-500 font-medium mb-1">Desde</span>
              <span className="text-2xl font-bold text-emerald-700">
                ${cabin.precio_noche.toLocaleString('es-CO')}
              </span>
            </div>
          </div>
          <Link 
            to={`/reservas?cabin=${cabin.id}`}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500 transition-colors shadow-sm shadow-emerald-100 flex-shrink-0"
          >
            Reservar
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Sección de visualización contenedora
 */
export function CabinsSection() {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCabins();
        setCabins(data);
      } catch (error) {
        console.error("Error al cargar cabañas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const scrollContainer = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.7;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="cabins" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header de la sección simplificado */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div className="text-left max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
              Nuestras Cabañas
            </h2>
            <p className="text-sm md:text-base text-stone-600">
              Cada cabaña está diseñada para ofrecer el máximo confort integrándose con el entorno natural.
            </p>
          </div>

          {!loading && cabins.length > 0 && (
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button 
                onClick={() => scrollContainer('left')} 
                className="p-2.5 rounded-full border border-stone-200 bg-white hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 transition-all shadow-sm active:scale-95"
                aria-label="Anterior cabaña"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollContainer('right')} 
                className="p-2.5 rounded-full border border-stone-200 bg-white hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 transition-all shadow-sm active:scale-95"
                aria-label="Siguiente cabaña"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Renderizado de contenido */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
            <p className="text-stone-400 text-sm font-medium">Cargando experiencias...</p>
          </div>
        ) : (
          /* El ancho de las tarjetas ahora se decide de manera exacta aquí */
          <div 
            ref={containerRef}
            className="flex overflow-x-auto gap-5 pb-6 snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            {cabins.map((cabin, index) => (
              <div 
                key={cabin.id} 
                // Modificado: Ahora las columnas miden exactamente lo que tú decidas según el viewport
                className="w-[78vw] sm:w-[320px] md:w-[350px] flex-none snap-center snap-always"
              >
                <CabinCard cabin={cabin} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}