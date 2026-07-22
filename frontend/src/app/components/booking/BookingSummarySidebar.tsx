/**
 * Subcomponente: Barra lateral de resumen de reserva
 * Muestra el desglose de costos y detalles seleccionados en tiempo real.
 */
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { Service } from "../../types.ts";

export function BookingSummarySidebar({
  selectedCabin,
  planType,
  dateRange,
  date,
  isMultiDay,
  nights,
  timeBlock,
  guests,
  cabinPrice,
  extraGuests,
  extraGuestsPrice,
  selectedServices,
  services,
  subtotal,
  deposit,
}: any) {
  const planDisplay = planType || "Sin plan";

  return (
    <div className="w-full lg:w-[400px]">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-100 p-6 sm:p-8 sticky top-28">
        <h3 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">Resumen de Reserva</h3>
        
        <div className="flex items-center gap-4 mb-6">
          {selectedCabin?.img_url && selectedCabin.img_url.length > 0 ? (
            <img src={selectedCabin.img_url[1] || selectedCabin.img_url[0]} alt={selectedCabin.nombre} className="w-20 h-20 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 shrink-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold text-center">Cargando...</span>
            </div>
          )}
          <div>
            <h4 className="font-bold text-stone-900">{selectedCabin?.nombre || "Cargando..."}</h4>
            <div className="text-sm text-stone-500 capitalize">{planDisplay}</div>
            {selectedCabin?.es_promocion && cabinPrice > 0 && (
              <div className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold mt-1 inline-block">
                Precio Especial Aplicado
              </div>
            )}
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
          {planType === "occasional" && timeBlock ? (
            <div className="flex justify-between">
              <span className="text-stone-500 flex items-center gap-2">Horario</span>
              <span className="font-medium text-emerald-700 text-right">{timeBlock}</span>
            </div>
          ) : planType !== "occasional" && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Check-in</span>
                <span className="font-medium text-emerald-700">3:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Check-out</span>
                <span className="font-medium text-emerald-700">1:00 PM</span>
              </div>
            </div>
          )}
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
            <strong>Nota:</strong> Si se pasan 5 min del Check-out, se cobrará una hora adicional ($50.000).
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500 flex items-center gap-2"><Users className="w-4 h-4"/> Huéspedes</span>
            <span className="font-medium">{guests} personas</span>
          </div>
        </div>
 
        <div className="space-y-3 mb-6 pb-6 border-b border-stone-100 text-sm">
          <div className="flex justify-between font-medium">
            <span className="text-stone-700">Estadía ({planDisplay})</span>
            <span>${cabinPrice.toLocaleString('es-CO')}</span>
          </div>
          {extraGuests > 0 && (
            <div className="flex justify-between text-stone-600">
              <span className="truncate pr-4">Huéspedes extras ({extraGuests}) x {nights} n.</span>
              <span>${extraGuestsPrice.toLocaleString('es-CO')}</span>
            </div>
          )}
          
          {selectedServices.map((id: string) => {
            const s = services.find((service: Service) => service.id === id)
            if (!s) return null;
            return (
              <div key={id} className="flex justify-between text-stone-600">
                <span className="truncate pr-4">{s.nombre}</span>
                <span>{s.precio === 0 ? '0' : `$${s.precio.toLocaleString('es-CO')}`}</span>
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
