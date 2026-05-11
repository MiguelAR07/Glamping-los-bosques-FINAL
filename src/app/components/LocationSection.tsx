import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

export function LocationSection() {
  return (
    <section id="location" className="py-24 px-4 sm:px-6 lg:px-12 bg-white relative overflow-hidden text-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <MapPin className="w-8 h-8 text-emerald-600" />
            <h2 className="text-4xl font-bold text-stone-900">Nuestra Ubicación</h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-stone-600 max-w-2xl mx-auto"
          >
            Estamos ubicados en el hermoso municipio de <span className="font-bold text-emerald-700">Marinilla, Antioquia</span>. Un refugio natural a pocos minutos de la ciudad.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl overflow-hidden shadow-2xl border border-stone-200 h-[500px] relative"
        >
          {/* Embed de Google Maps */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.7481134268!2d-75.3390442!3d6.1566351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e46a1c58923f2a1%3A0xccb21ed4396e613!2sGlamping%20los%20bosques!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
            title="Mapa de Glamping Los Bosques en Marinilla"
          ></iframe>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=6.1566351,-75.3390442" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full font-bold shadow-lg transition-all hover:scale-105"
          >
            <Navigation className="w-5 h-5" />
            Cómo llegar (Indicaciones)
          </a>
        </motion.div>
      </div>
    </section>
  );
}
