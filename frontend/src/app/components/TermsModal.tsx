import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getTerms } from "../api";

interface TermItem {
  id: number;
  titulo: string;
  contenido: string;
  categoria?: string;
  orden?: number;
}

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar términos desde el backend cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setLoading(true);
      getTerms()
        .then((data) => {
          if (data && data.length > 0) {
            setTerms(data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Términos y Condiciones</h2>
                  <p className="text-sm text-stone-500 mt-1">Glamping Los Bosques • Marinilla, Ant.</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto px-8 py-6 flex flex-col gap-7 text-stone-700 text-sm leading-relaxed">

                <p className="text-stone-500 italic">
                  Al realizar una reserva con Glamping Los Bosques, aceptas cumplir con los siguientes términos y condiciones vigentes:
                </p>

                {loading && (
                  <div className="flex justify-center py-8 text-stone-400">
                    <span>Cargando términos y condiciones...</span>
                  </div>
                )}

                {!loading && terms.length > 0 && terms.map((term) => (
                  <Section key={term.id} title={term.titulo} category={term.categoria}>
                    <p className="text-stone-700 whitespace-pre-line leading-relaxed">
                      {term.contenido}
                    </p>
                  </Section>
                ))}

                {!loading && terms.length === 0 && (
                  <>
                    <Section title="1. Política de reserva">
                      <Li>Para confirmar tu reserva debes pagar el <strong>50% del valor total</strong> en el momento de agendar.</Li>
                      <Li>El <strong>100% del valor</strong> debe estar pagado al menos <strong>24 horas antes</strong> de tu llegada.</Li>
                    </Section>
                    <Section title="2. Check-in (Ingreso)">
                      <Li>Para ingresar debes presentar tu <strong>cédula física (original)</strong>.</Li>
                    </Section>
                  </>
                )}

                {/* Privacidad de Datos */}
                <div className="border-t border-stone-200 pt-6">
                  <h3 className="font-bold text-stone-900 text-base mb-3">Privacidad de Datos Personales</h3>
                  <p className="text-stone-600">Los datos personales proporcionados por usuarios o visitantes no serán compartidos a terceros, salvo con expresa autorización o requerimiento de autoridad competente, dando aplicación a la <strong>Ley de Protección de Datos Personales 1581 de 2012</strong>.</p>
                </div>

              </div>

              {/* Footer del modal */}
              <div className="px-8 py-5 border-t border-stone-100 shrink-0 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Entendido
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Componentes auxiliares para estructura limpia
function Section({ title, category, children }: { title: string; category?: string; children: React.ReactNode }) {
  return (
    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-stone-900 text-base">{title}</h3>
        {category && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/50">
            {category}
          </span>
        )}
      </div>
      <div className="text-stone-700">{children}</div>
    </div>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 mb-1.5">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
      <span>{children}</span>
    </li>
  );
}
