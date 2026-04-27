/**
 * Sección de Testimonios
 * Muestra las reseñas de Google Maps en un diseño de cuadrícula.
 */
import { motion } from "framer-motion";
import { Star, Quote, ExternalLink } from "lucide-react";

// 1. Datos reales de las reseñas (extraídos de Google Maps)
const TESTIMONIALS_DATA = [
  {
    name: "Karen Montoya Chaverra",
    text: "¡Una experiencia increíble! El glamping superó totalmente mis expectativas. Todo estaba muy limpio, cómodo y rodeado de naturaleza. La atención fue excelente, se nota el amor con el que manejan el lugar.",
    rating: 5,
    date: "Hace 5 meses"
  },
  {
    name: "Andrea Castaño",
    text: "Un lugar increíble, perfecto para descansar y pasar un buen rato. Y la atención 10 de 10. ¡Volvería sin duda!",
    rating: 5,
    date: "Hace 5 meses"
  },
  {
    name: "MATEO MACRERO",
    text: "La mejor experiencia de mi vida, es una completa belleza sus instalaciones y súper bien el servicio. 10/10 recomendado.",
    rating: 5,
    date: "Hace 5 meses"
  }
];

// 2. Componente Individual de la Reseña (Tarjeta)
function ReviewCard({ testimonial, index }: { testimonial: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="bg-stone-800 rounded-2xl p-8 border border-stone-700 flex flex-col relative"
    >
      <Quote className="absolute top-6 right-6 w-10 h-10 text-stone-700" />
      
      {/* Estrellas */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < testimonial.rating ? 'fill-emerald-500 text-emerald-500' : 'fill-stone-600 text-stone-600'}`} 
          />
        ))}
      </div>
      
      {/* Texto principal */}
      <p className="text-stone-300 italic mb-8 flex-1 leading-relaxed">
        "{testimonial.text}"
      </p>
      
      {/* Autor */}
      <div className="mt-auto">
        <p className="font-bold text-white">{testimonial.name}</p>
        <p className="text-sm text-stone-500">{testimonial.date}</p>
      </div>
    </motion.div>
  );
}

// 3. Sección Principal que agrupa las reseñas
export function TestimonialsSection() {
  const googleReviewUrl = "https://g.page/r/CRPmlkPtIcsMEAE/review";

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-12 bg-stone-900 relative overflow-hidden text-center">
      {/* Fondo con destellos de color esmeralda (Opcional) */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-900/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            Lo que dicen nuestros huéspedes
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-stone-400 max-w-2xl mx-auto"
          >
            La mejor recompensa es saber que logramos crear experiencias memorables.
          </motion.p>
        </div>

        {/* Grid Responsive de las Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {TESTIMONIALS_DATA.map((testimonial, index) => (
            <ReviewCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* CTA para dejar reseña en Google */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center"
        >
          <p className="text-stone-400 mb-6">¿Nos has visitado recientemente?</p>
          <a 
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-700 text-white rounded-full font-bold hover:bg-emerald-600 transition-all shadow-xl hover:scale-105"
          >
            Dejanos tu reseña en Google
            <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
