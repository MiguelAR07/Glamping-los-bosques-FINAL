/**
 * Ruta de Política de Privacidad
 * Página pública requerida por Meta (WhatsApp Business) y por la Ley 1581 de 2012.
 */
export function Privacidad() {
  return (
    <div className="bg-white min-h-[80vh] flex flex-col">
      <div className="bg-stone-900 py-12 px-4 shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Política de Privacidad</h1>
          <p className="text-stone-300 text-lg max-w-2xl mx-auto">Última actualización: 21 de octubre de 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-stone-700 leading-relaxed">
        <Section title="1. Responsable del tratamiento">
          <p><strong>Glamping Los Bosques</strong>, Marinilla, Antioquia, Colombia. Correo: <a className="text-emerald-700 underline" href="mailto:glampinglosbosques@gmail.com">glampinglosbosques@gmail.com</a> · WhatsApp: 310 359 9065.</p>
        </Section>

        <Section title="2. Datos que recopilamos">
          <p>Cuando haces una reserva o nos escribes, podemos recopilar: nombre completo, número de documento de identidad, correo electrónico, número de teléfono / WhatsApp, fechas y detalles de la reserva, y comprobantes de pago.</p>
        </Section>

        <Section title="3. Para qué usamos tus datos">
          <ul className="list-disc pl-5 space-y-1">
            <li>Gestionar, confirmar y modificar tus reservas.</li>
            <li>Enviarte confirmaciones, recordatorios y avisos de pago por correo electrónico y WhatsApp.</li>
            <li>Responder tus mensajes y solicitudes de atención.</li>
            <li>Cumplir obligaciones legales, como el registro de huéspedes.</li>
          </ul>
        </Section>

        <Section title="4. WhatsApp">
          <p>Usamos la plataforma WhatsApp Business de Meta para comunicarnos contigo sobre tus reservas. Los mensajes que nos envías por WhatsApp se procesan para atender tu solicitud y no se usan para publicidad de terceros. Puedes pedir que dejemos de escribirte por WhatsApp en cualquier momento respondiendo "STOP" o contactándonos.</p>
        </Section>

        <Section title="5. Con quién compartimos tus datos">
          <p>No vendemos ni compartimos tus datos personales con terceros, salvo con los proveedores necesarios para operar el servicio (alojamiento web, correo electrónico y WhatsApp de Meta), con tu autorización expresa o por requerimiento de autoridad competente.</p>
        </Section>

        <Section title="6. Conservación y seguridad">
          <p>Conservamos tus datos solo durante el tiempo necesario para las finalidades descritas y las obligaciones legales aplicables, y aplicamos medidas técnicas razonables para protegerlos.</p>
        </Section>

        <Section title="7. Tus derechos">
          <p>De acuerdo con la <strong>Ley 1581 de 2012</strong> y el Decreto 1377 de 2013, puedes conocer, actualizar, rectificar y solicitar la eliminación de tus datos, así como revocar tu autorización. Para ejercer estos derechos escríbenos a <a className="text-emerald-700 underline" href="mailto:glampinglosbosques@gmail.com">glampinglosbosques@gmail.com</a>; responderemos dentro de los plazos legales.</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-stone-900 mb-3">{title}</h2>
      {children}
    </section>
  );
}
