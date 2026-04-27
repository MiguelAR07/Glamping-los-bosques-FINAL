import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle2, Download, Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

/**
 * Página de Confirmación de Reserva
 * Muestra el resumen final al cliente después de generar la factura.
 */
export function BookingConfirmation() {
  const location = useLocation();
  const state = location.state;

  // Si alguien entra a la URL directamente sin haber reservado, lo mandamos al inicio
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { cabin, planType, dateRange, guests, total, deposit, formData } = state;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
        {/* Header Success */}
        <div className="bg-emerald-600 px-8 py-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1614022837662-e74b0b53dcf3?w=800&q=20')] opacity-10 bg-cover bg-center"></div>
          <CheckCircle2 className="w-20 h-20 mx-auto text-emerald-200 mb-6 relative z-10" />
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 relative z-10">¡Recibo Generado!</h1>
          <p className="text-emerald-100 text-lg relative z-10 max-w-xl mx-auto">
            Hola {formData.name}, hemos generado tu recibo de reserva. Tu estadía en {cabin.name} quedará confirmada una vez abones el anticipo.
          </p>
        </div>

        {/* Detalles */}
        <div className="px-8 py-10">
          <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">Detalles de la Reserva</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <p className="font-semibold text-stone-900">{cabin.name}</p>
                  <p className="text-sm text-stone-500 capitalize">Plan {planType.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <p className="font-semibold text-stone-900">Fecha</p>
                  <p className="text-sm text-stone-500">
                    {dateRange.to 
                      ? `${dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : ''} - ${format(dateRange.to, 'dd/MM/yyyy')}`
                      : (dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : '')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <p className="font-semibold text-stone-900">Huéspedes</p>
                  <p className="text-sm text-stone-500">{guests} personas</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-4 border-t border-stone-100">
                <div className="space-y-2">
                  <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Titular de la reserva</p>
                  <p className="text-sm font-medium text-stone-700">{formData.name}</p>
                  <p className="text-sm text-stone-600">{formData.documentType} {formData.document}</p>
                  <p className="text-sm text-stone-600">{formData.country}</p>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide">Resumen Financiero</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Valor Total</span>
                  <span>${total.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold text-base py-2 border-y border-stone-200 my-2">
                  <span>Anticipo a Pagar (50%)</span>
                  <span>${deposit.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold">
                  <span>Saldo Pendiente</span>
                  <span>${(total - deposit).toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center border-t border-stone-100 pt-8">
            <Link to="/" className="px-6 py-3 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 transition-colors text-center">
              Volver al Inicio
            </Link>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-500 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] text-center flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Descargar Comprobante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
