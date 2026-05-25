/**
 * Sección de Testimonios
 * Muestra las reseñas de Google Maps en un diseño de cuadrícula.
 */
import { motion } from "framer-motion";
import { Star, Quote, ExternalLink, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createReview, getReviews } from "../api";

// 1. Datos reales de las reseñas (extraídos de Google Maps) como respaldo
const FALLBACK_TESTIMONIALS = [
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
      className="bg-stone-800 rounded-2xl p-8 border border-stone-700 flex flex-col relative h-full"
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
      <div className="mt-auto flex items-center gap-4">
        {testimonial.profile_photo_url && (
          <img 
            src={testimonial.profile_photo_url} 
            alt={testimonial.name} 
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <p className="font-bold text-white">{testimonial.name}</p>
          <p className="text-sm text-stone-500">{testimonial.date}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<any[]>(FALLBACK_TESTIMONIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    rating: 5,
    texto: ""
  });

  useEffect(() => {
    async function fetchReviews() {
      try {
        const json = await getReviews();
        
        if (json.success && json.data && json.data.length > 0) {
          // Transformar los datos de la BD al formato del frontend
          const formattedReviews = json.data.map((r: any) => ({
            name: r.nombre,
            text: r.texto,
            rating: r.rating,
            date: "Reciente"
          }));
          // Mostrar máximo 3 reseñas en la cuadrícula para mantener el diseño
          setReviews(formattedReviews.slice(0, 3));
        }
      } catch (error) {
        console.error("Error cargando reseñas en vivo, usando respaldo:", error);
      }
    }

    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.texto) return;
    
    setIsSubmitting(true);
    try {
      const res = await createReview({
        nombre: formData.nombre,
        rating: formData.rating,
        texto: formData.texto
      });
      
      // Añadir la reseña al principio de la lista y mantener solo 3 visibles
      setReviews(prev => [
        {
          name: res.data.nombre,
          text: res.data.texto,
          rating: res.data.rating,
          date: "Justo ahora"
        },
        ...prev
      ].slice(0, 3));
      
      // Cerrar modal y limpiar
      setIsModalOpen(false);
      setFormData({ nombre: "", rating: 5, texto: "" });
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      alert("Hubo un error al enviar tu reseña. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-12 bg-stone-900 relative overflow-hidden text-center">
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
          {reviews.map((testimonial, index) => (
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
          {/* Botones Inferiores */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://www.google.com/maps/place/Glamping+los+bosques/@6.1566351,-75.3390442,17z/data=!3m1!4b1!4m6!3m5!1s0x8e46a1c58923f2a1:0xccb21ed4396e613!8m2!3d6.1566351!4d-75.3390442!16s%2Fg%2F11w2cyd513" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors border border-white/20 w-full sm:w-auto">
              Ver todas las reseñas en Google
              <ExternalLink className="w-4 h-4" />
            </a>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold shadow-lg transition-colors w-full sm:w-auto"
            >
              Escribir una reseña
              <Star className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modal para escribir reseña */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg relative text-left"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold text-stone-900 mb-6">Tu experiencia importa</h3>
            
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Tu nombre</label>
                <input 
                  type="text" 
                  required
                  value={formData.nombre}
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-stone-900"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({...formData, rating: num})}
                      className="p-1 focus:outline-none"
                    >
                      <Star className={`w-8 h-8 transition-colors ${num <= formData.rating ? 'fill-emerald-500 text-emerald-500' : 'fill-stone-200 text-stone-200 hover:text-emerald-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Tu comentario</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.texto}
                  onChange={e => setFormData({...formData, texto: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-stone-900 resize-none"
                  placeholder="¿Qué tal estuvo tu estadía?"
                />
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Publicar Reseña"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
