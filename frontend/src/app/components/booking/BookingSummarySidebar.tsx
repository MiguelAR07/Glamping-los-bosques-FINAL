/**
 * Subcomponente: Barra lateral de resumen de reserva
 * Muestra el desglose de costos y detalles seleccionados en tiempo real.
 */
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { Service, formatCOP } from "../../types.ts";

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
  adults,
  childrenCount,
  pets,
  extraGuests,
  extraGuestsPrice,
  petsPrice,
  selectedServices,
  services,
  subtotal,
  deposit,
  setStep,
}: any) {
  const planDisplay = planType || "Sin plan";

  return (
    <div className="w-full lg:w-[400px]">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-100 p-6 sm:p-8 sticky top-28">
        <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
          <h3 className="text-xl font-bold text-stone-900">Resumen de Reserva</h3>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          {selectedCabin?.img_url && selectedCabin.img_url.length > 0 ? (
            <img src={selectedCabin.img_url[0]} alt={selectedCabin.nombre} className="w-20 h-20 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 shrink-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold text-center">Cargando...</span>
            </div>
          )}
          <div>
            <h4 className="font-bold text-stone-900">{selectedCabin?.nombre || "Cargando..."}</h4>
            <div className="text-sm text-stone-500 capitalize">{planDisplay}</div>
            {setStep && (
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline mt-1 block"
              >
                Cambiar cabaña o plan
              </button>
            )}
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
          {planType?.toLowerCase().includes("ocasional") && timeBlock ? (
            <div className="flex justify-between">
              <span className="text-stone-500 flex items-center gap-2">Horario</span>
              <span className="font-medium text-emerald-700 text-right">{timeBlock}</span>
            </div>
          ) : !planType?.toLowerCase().includes("ocasional") && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-stone-500">{planType?.toLowerCase().includes('sol') ? 'Llegada' : 'Check-in'}</span>
                <span className="font-medium text-emerald-700">{planType?.toLowerCase().includes('sol') ? '10:00 AM' : '3:00 PM'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{planType?.toLowerCase().includes('sol') ? 'Salida' : 'Check-out'}</span>
                <span className="font-medium text-emerald-700">{planType?.toLowerCase().includes('sol') ? '5:00 PM' : '1:00 PM'}</span>
              </div>
            </div>
          )}
          <div className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 font-medium">
            <strong>⚠️ Nota:</strong> Si se pasan 5 min del Check-out, se cobrará una hora adicional ($50.000).
          </div>
          <div className="flex flex-col gap-1 text-stone-500 mt-2 bg-stone-50 p-3 rounded-lg border border-stone-100">
            <div className="flex justify-between">
              <span className="flex items-center gap-2"><Users className="w-4 h-4"/> Huéspedes Totales</span>
              <span className="font-medium text-stone-900">{guests} personas</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Adultos / mayores a 3 años</span>
              <span className="font-medium text-stone-900">{adults}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Niños menores a 3 años</span>
              <span className="font-medium text-stone-900">{childrenCount}</span>
            </div>
            {pets > 0 && (
              <div className="flex justify-between text-xs text-amber-700">
                <span>Mascotas</span>
                <span className="font-medium">{pets}</span>
              </div>
            )}
          </div>
        </div>
 
        <div className="space-y-3 mb-6 pb-6 border-b border-stone-100 text-sm">
          <div className="flex justify-between font-medium">
            <span className="text-stone-700">Estadía ({planDisplay})</span>
            <span>${formatCOP(cabinPrice)}</span>
          </div>
          {extraGuests > 0 && (
            <div className="flex justify-between text-stone-600">
              <span className="truncate pr-4">Huéspedes extras ({extraGuests}) x {nights} n.</span>
              <span>${formatCOP(extraGuestsPrice)}</span>
            </div>
          )}
          {pets > 0 && (
            <div className="flex justify-between text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded">
              <span className="truncate pr-4">Mascotas ({pets})</span>
              <span>${formatCOP(petsPrice)}</span>
            </div>
          )}
          
          {selectedServices.map((id: string) => {
            const s = services.find((service: Service) => service.id === id)
            if (!s) return null;
            return (
              <div key={id} className="flex justify-between text-stone-600">
                <span className="truncate pr-4">{s.nombre}</span>
                <span>{s.precio === 0 ? '0' : `$${formatCOP(s.precio)}`}</span>
              </div>
            )
          })}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-stone-500 text-sm">
            <span>Subtotal</span>
            <span>${formatCOP(subtotal)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-stone-900 pt-2 border-t border-stone-100">
            <span>Total a pagar (Anticípo 50%)</span>
            <span className="text-emerald-700">${formatCOP(deposit)}</span>
          </div>
          <p className="text-xs text-stone-400 text-center mt-4">
            El 50% restante (${formatCOP(subtotal - deposit)}) se paga en el enlace que aparecerá en la factura de confirmación de reserva.
          </p>
        </div>
      </div>
    </div>
  );
}
