/**
 * Subcomponente: Paso 1 del Wizard de Reservas
 * Renderiza la selección de cabaña, tipo de plan, fechas y número de huéspedes.
 */
import { Cabin } from '../../types.ts'
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export function BookingStep1Details({
  guests, setGuests, cabins,
  selectedCabinId, setSelectedCabinId,
  planType,
  packageTypes = [],
  selectedPlanTypeId,
  setSelectedPlanTypeId,
  date, setDate,
  dateRange, setDateRange,
  timeBlock, setTimeBlock,
  isMultiDay, selectedCabin, handleNext
}: any) {
  return (
    <div className="space-y-8">
      <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-100 text-sm font-medium">
        ⚠️ Nota importante: No se alquilan cabañas a menores de edad si no vienen acompañados por sus padres.
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-3">Selecciona tu Cabaña</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cabins.map((c: Cabin) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCabinId(c.id);
                if (guests > c.maxGuests) setGuests(c.maxGuests);
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedCabinId === c.id 
                  ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                  : 'border-stone-200 bg-white hover:border-emerald-200'
              }`}
            >
              <div className="font-bold text-stone-900">{c.nombre}</div>
              <div className="text-xs text-stone-500 mt-1">Desde ${c.plans.occasional.toLocaleString('es-CO')}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-3">Tipo de Plan</label>
        <div className="grid grid-cols-2 gap-3">
          {packageTypes.map((type: any) => (
            <button
              key={type.tipo_id}
              onClick={() => setSelectedPlanTypeId(type.tipo_id)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                selectedPlanTypeId === type.tipo_id
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300"
              }`}
            >
              {type.nombre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-3">Fechas</label>
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex justify-center">
          {isMultiDay ? (
            <DayPicker 
              mode="range" 
              selected={dateRange as any} 
              onSelect={setDateRange as any} 
              className="bg-transparent"
              classNames={{
                day_selected: "bg-emerald-600 text-white hover:bg-emerald-700",
                day_today: "font-bold text-emerald-600"
              }}
            />
          ) : (
            <DayPicker 
              mode="single" 
              selected={date} 
              onSelect={setDate} 
              className="bg-transparent"
              classNames={{
                day_selected: "bg-emerald-600 text-white hover:bg-emerald-700",
                day_today: "font-bold text-emerald-600"
              }}
            />
          )}
        </div>
      </div>

      {planType === "occasional" && (
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-3">Bloque de Horario (Ocasional)</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["8:00 AM - 1:00 PM", "1:00 PM - 6:00 PM", "6:00 PM - 11:00 PM"].map(block => (
              <button 
                key={block}
                onClick={() => setTimeBlock(block)} 
                className={`p-3 rounded-xl border text-sm font-medium ${timeBlock === block ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"}`}
              >
                {block}
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Nota: Los planes ocasionales de la mañana permiten reservar un plan de noche (amanecida) el mismo día a partir de las 3:00 PM sin conflicto.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-3">Número de personas (Max. {selectedCabin.maxGuests})</label>
        <div className="flex items-center gap-4">
          <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100">-</button>
          <span className="text-xl font-medium w-6 text-center">{guests}</span>
          <button onClick={() => setGuests(Math.min(selectedCabin.maxGuests, guests + 1))} disabled={guests >= selectedCabin.maxGuests} className={`w-10 h-10 rounded-full border flex items-center justify-center ${guests >= selectedCabin.maxGuests ? 'opacity-50 cursor-not-allowed bg-stone-100 border-stone-200' : 'border-stone-300 hover:bg-stone-100'}`}>+</button>
        </div>
        {guests > 2 && selectedCabin.additionalPersonPrice > 0 && (
          <p className="text-xs text-stone-500 mt-2">
              Se aplica cobro por {guests - 2} persona(s) adicional(es) (${selectedCabin.additionalPersonPrice.toLocaleString('es-CO')} c/u)
          </p>
        )}
      </div>

      <button 
        onClick={handleNext} 
        disabled={isMultiDay ? (!dateRange.from || !dateRange.to) : (!date || (planType === "occasional" && !timeBlock))}
        className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar a Extras
      </button>
    </div>
  );
}
