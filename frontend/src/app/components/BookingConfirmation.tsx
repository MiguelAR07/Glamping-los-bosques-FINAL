import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle2, UploadCloud, Calendar, MapPin, Users, Building2, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState, useRef } from "react";

export function BookingConfirmation() {
  const location = useLocation();
  const state = location.state;
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirigir si no hay estado (evita errores de renderizado)
  if (!state) {
    return <Navigate to="/" replace />;
  }

  // Extraemos los datos que vienen del handleCheckout de BookingSection
  const { 
    reservaId, 
    nombreCliente, 
    documento,
    tipoDocumento,
    total, 
    deposito, 
    cabinName, 
    dateRange, 
    date, 
    planType, 
    planName,
    guests 
  } = state;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("El archivo es demasiado grande. Máximo 5MB.");
        return;
      }
      setFile(selectedFile);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Por favor, sube un comprobante de pago.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("comprobante", file);

      const response = await fetch(`http://localhost:3000/api/reservations/${reservaId}/payment`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || "Error al subir el comprobante");
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error al subir comprobante:", err);
      setError(err.message || "Error al subir el comprobante");
    } finally {
      setIsSubmitting(false);
    }
  };

  {/* Función auxiliar para formatear con seguridad */}
  const safeFormat = (dateValue: any) => {
    if (!dateValue) return "Fecha no definida";
    const d = new Date(dateValue);
    // Verificar si el objeto Date es válido
    if (isNaN(d.getTime())) return "Fecha inválida";
    return format(d, 'dd/MM/yyyy');
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 py-12 px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-4">¡Reserva en Proceso!</h2>
          <p className="text-stone-600 mb-8">
            Hola <span className="font-bold text-stone-800">{nombreCliente}</span>, hemos registrado tu comprobante para la reserva <span className="font-mono bg-stone-100 px-2 py-1 rounded">#{reservaId}</span>. 
            Verificaremos el pago y te contactaremos pronto.
          </p>
          <Link to="/" className="block w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  {/* Definición de nombres de planes en español */}
  const planNames: Record<string, string> = {
    week: "Semana",
    weekend: "Fin de Semana / Festivo",
    sun_day: "Día de Sol",
    occasional: "Ocasional"
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200">
        <div className="bg-emerald-600 p-8 text-center text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Confirmación de Pago</h1>
          <p className="opacity-90 mt-2">Revisa los detalles de tu reserva y realiza el pago del anticipo para asegurar tu estadía.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Resumen */}
          <div className="p-8 bg-stone-50/50 border-r border-stone-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Resumen de Estadía
            </h2>
            
            <div className="space-y-4 text-stone-700">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <div>
                <p className="font-semibold text-stone-900">{cabinName}</p>
                <p className="text-sm text-stone-500 capitalize">Plan {planNames[planType] || planType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>
                  {/* Priorizamos dateRange, si no, usamos date (pasadía) */}
                  <p className="font-semibold text-stone-900">Fecha</p>
                  {dateRange && dateRange.from 
                    ? `${safeFormat(dateRange.from)}${dateRange.to ? ` - ${safeFormat(dateRange.to)}` : ''}`
                    : safeFormat(date)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-emerald-600" />
                <div>
                <p className="font-semibold text-stone-900">Huéspedes</p>
                <span>{guests} Personas</span>
                </div>
              </div>
            </div>

             <div className="flex items-start gap-3 pt-4 border-t border-stone-200">
                <div className="space-y-1">
                  <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">A nombre de</p>
                  <p className="text-sm font-medium text-stone-700">{nombreCliente}</p>
                  <p className="text-sm text-stone-600">{tipoDocumento} {documento}</p>
                </div>
              </div>

            <div className="mt-8 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-sm text-stone-500 uppercase font-bold mb-1">Valor del Anticipo</p>
              <p className="text-3xl font-black text-emerald-700">${deposito.toLocaleString('es-CO')}</p>
              <p className="text-xs text-stone-400 mt-2 italic">Saldo a pagar en el check-in: ${(total - deposito).toLocaleString('es-CO')}</p>
            </div>
          </div>

          {/* Pago */}
          <div className="p-8">
            <h2 className="text-lg font-bold mb-6">Instrucciones de Pago</h2>
            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-xl border border-stone-200 bg-white flex items-center gap-4">
                <Building2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="text-xs text-stone-500 font-bold uppercase">Bancolombia Ahorros</p>
                  <p className="font-mono font-bold text-lg">123-456789-00</p>
                  <p className="text-xs text-stone-500">A nombre de Glamping Los Bosques SAS</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-stone-200 bg-white flex items-center gap-4">
                <div className="w-6 h-6 bg-purple-600 rounded text-white flex items-center justify-center text-[10px] font-bold">N</div>
                <div>
                  <p className="text-xs text-stone-500 font-bold uppercase">Nequi</p>
                  <p className="font-mono font-bold text-lg">310 359 9065</p>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-stone-900 mb-2">Sube tu comprobante</h3>
            <p className="text-sm text-stone-500 mb-3">Toma un pantallazo de tu transferencia exitosa y súbelo aquí para confirmar tu reserva.</p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                preview ? 'border-emerald-500 bg-emerald-50' : 'border-stone-300 hover:border-emerald-500 hover:bg-stone-50'
              }`}
            >
              
              <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
              {preview ? (
                <div className="space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-sm font-bold text-emerald-700">¡Imagen cargada!</p>
                  <button className="text-xs text-stone-400 underline">Cambiar imagen</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="text-sm font-medium text-stone-700">Sube aquí tu comprobante</p>
                  <p className="text-[10px] text-stone-400 uppercase">JPG o PNG (Máx 5MB)</p>
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-3 text-center font-medium bg-red-50 border border-red-100 py-2 px-4 rounded-xl">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !preview}
              className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 disabled:opacity-50 disabled:bg-stone-300 flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isSubmitting ? "Procesando..." : "Finalizar Reserva"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}