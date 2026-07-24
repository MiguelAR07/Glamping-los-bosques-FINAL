/**
 * Subcomponente: Paso 2 del Wizard de Reservas
 * Renderiza la lista de servicios adicionales opcionales.
 */
import { Service, formatCOP } from "../../types.ts";
import { Check } from "lucide-react";

export function BookingStep2Extras({
  services, selectedServices, toggleService, handleNext, handleBack
}: any) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-stone-900 mb-4">Servicios Adicionales (Opcional)</h3>
        <div className="space-y-3">
          {services.map((s: Service) => (
            <label key={s.id} onClick={() => toggleService(s.id)} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${selectedServices.includes(s.id) ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 bg-white hover:border-emerald-200'}`}>
              <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center ${selectedServices.includes(s.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300'}`}>
                {selectedServices.includes(s.id) && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1">
                <div className="font-bold text-stone-900 flex justify-between">
                  {s.nombre}
                  <span>{s.precio === 0 ? 'Gratis*' : `$${formatCOP(s.precio)}`}</span>
                </div>
                <div className="text-sm text-stone-500 mt-1">{s.descripcion}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={handleBack} className="w-1/3 py-4 bg-white text-stone-700 border border-stone-300 rounded-xl font-bold hover:bg-stone-50 transition-colors">
          Volver
        </button>
        <button onClick={handleNext} className="w-2/3 py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors">
          Continuar a Datos
        </button>
      </div>
    </div>
  );
}
