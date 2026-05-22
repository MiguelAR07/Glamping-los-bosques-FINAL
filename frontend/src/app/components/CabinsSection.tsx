import { useState, useEffect, useRef } from "react";
import { Trees, Wifi, Tv, Coffee, Flame, CheckCircle2, Car, Utensils, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Importamos el tipo y la función de la API
import { Cabin } from "../types.ts";
import { getCabins } from "../api.ts";

/**
 * Función auxiliar para mapear características de texto a íconos de Lucide
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

  return <Icon className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
};

/**
 * Tarjeta de Cabaña con datos de la base de datos
 */
const CabinCard = ({ cabin, index }: { cabin: Cabin, index: number }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  // Ajustamos para usar 'img_url' en lugar de 'images' según types.ts
  const images = cabin.img_url || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-stone-200/50 border border-stone-100 flex flex-col group hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="w-full aspect-[4/3] relative overflow-hidden bg-stone-100 group/carousel">
        {images.length > 1 && (
          <>
            <button 
              onClick={() => scroll('left')} 
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-full">
          {images.map((img: string, i: number) => (
            <div key={i} className="flex-none w-full h-full snap-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-stone-900/10 z-[1] pointer-events-none" />
              <div className="absolute top-4 right-4 z-[2] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium border border-white/20">
                {i + 1} / {images.length}
              </div>
              <img 
                src={img} 
                alt={`${cabin.nombre} - Vista ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
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
                ${cabin.plans.occasional.toLocaleString('es-CO')}
              </span>
            </div>
          </div>
          <Link 
            to="/reservas"
            className="w-full flex justify-center items-center py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-200"
          >
            Reservar ahora
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export function CabinsSection() {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargamos los datos reales al montar el componente
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

  return (
    <section id="cabins" className="py-20 md:py-24 px-4 sm:px-6 lg:px-12 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-stone-900 mb-4"
          >
            Nuestras Cabañas
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto"
          >
            Cada cabaña está diseñada para ofrecer el máximo confort integrándose armoniosamente con el entorno natural.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
            <p className="text-stone-500 font-medium">Cargando experiencias...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {cabins.map((cabin, index) => (
              <CabinCard key={cabin.id} cabin={cabin} index={index} />
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