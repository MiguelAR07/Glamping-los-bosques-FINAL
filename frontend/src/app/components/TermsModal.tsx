import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
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
                  Al hacer una reserva, aceptas cumplir las siguientes reglas:
                </p>

                <Section title="1. Política de reserva">
                  <Li>Para confirmar tu reserva debes pagar el <strong>50% del valor total</strong> en el momento de agendar.</Li>
                  <Li>Si no haces este pago, la reserva no queda confirmada.</Li>
                  <Li>El pago debe hacerse por los medios electrónicos indicados por el personal.</Li>
                  <Li>El <strong>100% del valor</strong> debe estar pagado al menos <strong>24 horas antes</strong> de tu llegada.</Li>
                </Section>

                <Section title="2. Check-in (Ingreso)">
                  <Li>Para ingresar debes presentar tu <strong>cédula física (original)</strong>. No se aceptan fotos ni copias.</Li>
                  <Li>No se permiten menores de edad. Si al llegar alguno de los huéspedes es menor, la reserva será cancelada y no se devuelve el dinero pagado.</Li>
                  <Li>El horario de ingreso es de <strong>3:00 p.m. a 9:00 p.m.</strong>, según lo acordado con el personal.</Li>
                </Section>

                <Section title="3. Check-out (Salida)">
                  <Li>Debes salir el último día de tu estadía antes de la <strong>1:00 p.m.</strong></Li>
                </Section>

                <Section title="4. Comportamiento dentro del lugar">
                  <Li>Todos los huéspedes deben mantener un buen comportamiento.</Li>
                  <Li>No está permitido hacer ruidos excesivos o molestar a otros huéspedes.</Li>
                  <Li>No se pueden realizar actividades ilegales.</Li>
                  <Li>Si algún huésped altera el orden o la tranquilidad, el establecimiento podrá tomar medidas, incluyendo llamar a la policía si es necesario.</Li>
                </Section>

                <Section title="5. Parqueadero">
                  <Li>El parqueadero es <strong>gratuito y al aire libre</strong>.</Li>
                  <Li>El glamping no se hace responsable por robos, pérdidas o daños en los vehículos o en objetos dejados dentro de ellos.</Li>
                </Section>

                <Section title="6. Responsabilidad">
                  <Li>Glamping Los Bosques no se hace responsable por situaciones fuera de su control.</Li>
                </Section>

                <Section title="7. Cancelación por parte del establecimiento">
                  <Li>El glamping puede cancelar reservas por causas externas (clima, fuerza mayor, etc.).</Li>
                  <Li>En ese caso, se devolverá el <strong>100% del dinero pagado</strong>.</Li>
                  <Li>No se cubren otros gastos en los que haya incurrido el huésped.</Li>
                </Section>

                <Section title="8. Cancelación por parte del cliente">
                  <Li>Si cancelas con <strong>3 días o más de anticipación</strong>, puedes cambiar la fecha sin perder el dinero.</Li>
                  <Li>La nueva fecha depende de disponibilidad y puede tener cambios en el precio según la temporada.</Li>
                  <Li>Si cancelas con menos tiempo o no te presentas, <strong>no se devuelve el dinero</strong>.</Li>
                </Section>

                <Section title="9. Reembolsos">
                  <Li>No se hacen devoluciones de dinero por cancelaciones del cliente.</Li>
                  <Li>Si cancelas con 3 días o más, puedes cambiar la fecha (sujeto a disponibilidad y posibles ajustes de precio).</Li>
                  <Li>Si cancelas con menos de 3 días o no te presentas, <strong>pierdes el dinero pagado</strong>.</Li>
                  <Li>Solo se hace reembolso del 100% si el glamping cancela por causas externas.</Li>
                  <Li>No se cubren gastos adicionales del cliente.</Li>
                </Section>

                {/* Separador */}
                <div className="border-t border-stone-200 pt-6">
                  <h3 className="font-bold text-stone-900 text-base mb-4">Políticas de Ofertas</h3>

                  <div className="flex flex-col gap-4 text-stone-600">
                    <p><strong className="text-stone-800">Ofertas generales:</strong> Se refieren a los servicios que ofrece Glamping Los Bosques por medio de su página u otros sitios web en donde el usuario acepta las condiciones establecidas.</p>

                    <p><strong className="text-stone-800">Ofertas diseñadas a necesidad del usuario:</strong> Son los servicios que se contratan a petición de cada usuario de acuerdo con sus requerimientos y/o necesidades.</p>

                    <p>El usuario acepta que a partir del momento en que haga uso de las instalaciones de Glamping Los Bosques se hará responsable por el pago de todos los daños y/o perjuicios que cause a sí mismo y a sus acompañantes.</p>

                    <p>El valor a pagar es el publicado en la página web o plataforma de terceros. Para ambos casos el precio deberá pagarse al <strong>50% en el momento de la reserva</strong> y el <strong>50% restante 24 horas antes</strong> de su estadía.</p>
                  </div>
                </div>

                {/* Privacidad */}
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
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-bold text-stone-900 mb-2.5 text-base">{title}</h3>
      <ul className="flex flex-col gap-1.5 pl-1">{children}</ul>
    </div>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
      <span>{children}</span>
    </li>
  );
}
