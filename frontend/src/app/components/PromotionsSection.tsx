import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Calendar, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function PromotionsSection() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002'}/api/promociones`);
        if (!res.ok) throw new Error("Error cargando promociones");
        const data = await res.json();
        // El backend ya filtra solo activos, pero hacemos doble check
        const promoData = data.filter((p: any) => p.estado?.toLowerCase() === "activo");
        setPromotions(promoData);
      } catch (err) {
        console.error("Error fetching promotions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-stone-500 flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
          <p>Cargando promociones...</p>
        </div>
      </section>
    );
  }

  // Ocultar la sección si no hay promociones activas
  if (promotions.length === 0) return null;

  return (
    <section
      className="py-24 bg-gradient-to-b from-stone-50 to-white relative overflow-hidden"
      id="promociones"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

        {/* Encabezado de sección */}
        <div className="mb-16 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold tracking-wider text-xs uppercase mb-4 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ofertas Exclusivas
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-stone-900 mb-4"
          >
            Promociones Especiales
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 text-lg leading-relaxed"
          >
            Aprovecha nuestros precios reducidos por tiempo limitado. ¡Reserva ya con los descuentos aplicados!
          </motion.p>
        </div>

        {/* Grid de cards de promociones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group bg-white rounded-none overflow-hidden shadow-xl shadow-stone-200/50 border border-stone-100 flex flex-col hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Etiqueta de promo flotante */}
              <div className="absolute top-4 left-4 z-30 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3 h-3" />
                Promo Especial
              </div>

              {/* Imagen / placeholder */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-100 to-stone-100 min-h-[200px] flex items-center justify-center">
                {promo.img_url ? (
                  <img
                    src={promo.img_url}
                    alt={promo.nombre}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full py-16 flex flex-col items-center justify-center text-emerald-300 gap-3">
                    <Sparkles className="w-16 h-16" />
                    <span className="text-emerald-600 font-semibold text-lg">{promo.nombre}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{promo.nombre}</h3>
                  {promo.descripcion && (
                    <p className="text-white/80 text-sm line-clamp-2">{promo.descripcion}</p>
                  )}
                </div>
              </div>

              {/* Contenido de la card */}
              <div className="p-6 flex flex-col flex-1">

                {/* Cabañas incluidas */}
                {promo.cabanas && promo.cabanas.length > 0 && (
                  <div className="flex items-start gap-2 mb-3 text-stone-600 text-sm">
                    <Home className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Aplica para:</strong>{" "}
                      {promo.cabanas.map((c: any) => c.nombre).join(", ")}
                    </span>
                  </div>
                )}

                {/* Fechas de vigencia */}
                {promo.fecha_inicio && promo.fecha_fin && (
                  <div className="flex items-center gap-2 mb-4 text-stone-500 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>
                      Válida del{" "}
                      <strong className="text-stone-700">
                        {format(new Date(promo.fecha_inicio), "d MMM", { locale: es })}
                      </strong>{" "}
                      al{" "}
                      <strong className="text-stone-700">
                        {format(new Date(promo.fecha_fin), "d MMM yyyy", { locale: es })}
                      </strong>
                    </span>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-stone-100">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xs text-stone-500 font-medium">Precio promocional</span>
                    <span className="text-2xl font-bold text-emerald-700">
                      ${(Number(promo.precio) < 1000 ? Number(promo.precio) * 1000 : Number(promo.precio)).toLocaleString("es-CO")}
                    </span>
                    <span className="text-xs text-stone-400">/noche</span>
                  </div>
                  <Link
                    to={`/reservas?promo=promo_${promo.id}${promo.cabanas && promo.cabanas.length > 0 ? `&cabin=${promo.cabanas[0].id}` : ''}`}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Reservar con esta Promo
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
