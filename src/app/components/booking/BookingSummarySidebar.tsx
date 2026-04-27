/**
 * Subcomponente: Barra lateral de resumen de reserva
 * Muestra el desglose de costos y detalles seleccionados en tiempo real.
 */
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { SERVICES } from "../../data";

export function BookingSummarySidebar({
  selectedCabin, planType, dateRange, date, isMultiDay, nights, timeBlock,
  guests, cabinPrice, extraGuests, extraGuestsPrice, selectedServices,
  subtotal, deposit
}: any) {
  return (
    <div className="w-full lg:w-[400px]">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-100 p-6 sm:p-8 sticky top-28">
        <h3 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">Resumen de Reserva</h3>
        
        <div className="flex items-center gap-4 mb-6">
          <img src={selectedCabin.images[0]} alt={selectedCabin.name} className="w-20 h-20 rounded-xl object-cover" />
          <div>
            <h4 className="font-bold text-stone-900">{selectedCabin.name}</h4>
            <div className="text-sm text-stone-500 capitalize">{planType.replace('_', ' ')}</div>
          </div>
        </div>

        <div className="space-y-4 mb-6 pb-6 border-b border-stone-100 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500 flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> Fecha</span>
            <span className="font-medium text-right">
              {isMultiDay 
                ? (dateRange.from && dateRange.to ? `${format(dateRange.from, 'dd/MM/yy')} - ${format(dateRange.to, 'dd/MM/yy')} (${nights} noches)` : 'Seleccionar fechas')
                : (date ? format(date, 'dd/MM/yyyy') : 'Seleccionar fecha')}
            </span>
          </div>
          {planType === "occasional" && timeBlock && (
            <div className="flex justify-between">
              <span className="text-stone-500 flex items-center gap-2">Horario</span>
              <span className="font-medium text-emerald-700 text-right">{timeBlock}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-stone-500 flex items-center gap-2"><Users className="w-4 h-4"/> Huéspedes</span>
            <span className="font-medium">{guests} personas</span>
          </div>
        </div>

        <div className="space-y-3 mb-6 pb-6 border-b border-stone-100 text-sm">
          <div className="flex justify-between font-medium">
            <span className="text-stone-700">Estadía ({planType})</span>
            <span>${cabinPrice.toLocaleString('es-CO')}</span>
          </div>
          {extraGuests > 0 && (
            <div className="flex justify-between text-stone-600">
              <span className="truncate pr-4">Huéspedes extras ({extraGuests}) x {nights} n.</span>
              <span>${extraGuestsPrice.toLocaleString('es-CO')}</span>
            </div>
          )}
          
          {selectedServices.map((id: string) => {
            const s = SERVICES.find(x => x.id === id);
            if (!s) return null;
            return (
              <div key={id} className="flex justify-between text-stone-600">
                <span className="truncate pr-4">{s.name}</span>
                <span>{s.price === 0 ? '0' : `$${s.price.toLocaleString('es-CO')}`}</span>
              </div>
            )
          })}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-stone-500 text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-stone-900 pt-2 border-t border-stone-100">
            <span>Total a pagar (Anticípo 50%)</span>
            <span className="text-emerald-700">${deposit.toLocaleString('es-CO')}</span>
          </div>
          <p className="text-xs text-stone-400 text-center mt-4">
            El saldo restante (${(subtotal - deposit).toLocaleString('es-CO')}) se pagará al momento del check-in.
          </p>
        </div>
      </div>
    </div>
  );
}
