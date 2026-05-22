import { BookingSection } from "../components/BookingSection";

/**
 * Ruta de la Página de Reservas
 * Contenedor independiente de página para el componente BookingSection.
 */
export function Reservas() {
  return (
    <div className="bg-white min-h-[80vh] flex flex-col">
      <div className="bg-stone-900 py-12 px-4 shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Haz tu Reserva</h1>
          <p className="text-stone-300 text-lg max-w-2xl mx-auto">Selecciona tu cabaña, escoge el plan perfecto y asegura tu escapada de lujo en medio de la naturaleza.</p>
        </div>
      </div>
      
      <div className="flex-1">
        <BookingSection />
      </div>
    </div>
  );
}
