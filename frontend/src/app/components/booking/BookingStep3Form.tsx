/**
 * Subcomponente: Paso 3 del Wizard de Reservas
 * Formulario de captura de datos personales y ejecución de la reserva.
 */
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";

export function BookingStep3Form({
  formData,
  setFormData,
  errors,
  handleBack,
  handleCheckout,
  isMultiDay,
  dateRange,
  date,
  deposit,
}: any) {
  // Estado local para manejar el feedback visual durante el POST a la base de datos
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validación de seguridad para habilitar el botón
  const isFormValid =
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.document &&
    formData.country &&
    (isMultiDay ? dateRange.from && dateRange.to : date);

  // Wrapper para manejar el estado de carga durante la transacción
  const onConfirm = async () => {
    setIsSubmitting(true);
    try {
      await handleCheckout();
    } catch (e) {
      console.error("Error en el componente hijo:", e);
    } finally {
      // Si hay un error, permitimos que el usuario intente de nuevo
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-stone-900 mb-4">Tus Datos</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Nombre Completo</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full p-3 rounded-lg border transition-all outline-none ${
              errors["cliente.nombre"] // <--- Verifica que esta llave exista
                ? "border-red-500 bg-red-50 ring-1 ring-red-500" 
                : "border-stone-300 focus:ring-2 focus:ring-emerald-500"
            }`}
            placeholder="Ej. Juan Pérez"
            disabled={isSubmitting}
          />
          {/* Mensaje de error dinámico */}
          {errors["cliente.nombre"] && (
            <span className="text-red-500 text-xs font-bold mt-1 block italic">
              {errors["cliente.nombre"]}
            </span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full p-3 rounded-lg border outline-none transition-all ${
              errors["cliente.email"] 
                ? "border-red-500 ring-1 ring-red-500" 
                : "border-stone-300 focus:ring-2 focus:ring-emerald-500"
            }`}
            placeholder="juan@ejemplo.com"
            disabled={isSubmitting}
          />
          {errors["cliente.email"] && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors["cliente.email"]}
            </p>
          )}
        </div>

        {/* Tipo Documento */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Tipo de Documento</label>
          <select
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            className="w-full p-3 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            disabled={isSubmitting}
          >
            <option value="C.C.">Cédula de Ciudadanía (C.C.)</option>
            <option value="C.E.">Cédula de Extranjería (C.E.)</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Nit">NIT</option>
          </select>
        </div>

        {/* Número Documento */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Número de Documento</label>
          <input
            type="text"
            value={formData.document}
            onChange={(e) => setFormData({ ...formData, document: e.target.value })}
            className={`w-full p-3 rounded-lg border outline-none transition-all ${
              errors["cliente.numero_identificacion"] 
                ? "border-red-500 ring-1 ring-red-500" 
                : "border-stone-300 focus:ring-2 focus:ring-emerald-500"
            }`}
            placeholder="Número de identificación"
            disabled={isSubmitting}
          />
          {errors["cliente.numero_identificacion"] && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors["cliente.numero_identificacion"]}</p>
          )}
        </div>

        {/* País */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">País de Residencia</label>
          <select
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full p-3 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            disabled={isSubmitting}
          >
            <option value="Colombia">Colombia</option>
            <option value="Estados Unidos">Estados Unidos</option>
            <option value="México">México</option>
            <option value="España">España</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Teléfono</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full p-3 rounded-lg border outline-none transition-all ${
              errors["cliente.contacto"] 
                ? "border-red-500 ring-1 ring-red-500" 
                : "border-stone-300 focus:ring-2 focus:ring-emerald-500"
            }`}
            placeholder="+57 300 000 0000"
            disabled={isSubmitting}
          />
          {errors["cliente.contacto"] && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors["cliente.contacto"]}</p>
          )}
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-stone-200">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4 mb-6">
          <div className="bg-emerald-500 text-white p-2 rounded-lg shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">Confirmación de Reserva</h4>
            <p className="text-sm text-stone-600">
              Al continuar, se registrarán tus datos y se generará la factura. 
              Recuerda que para asegurar tu cupo debes abonar el 50%: 
              <span className="font-bold text-emerald-700 ml-1">
                ${deposit.toLocaleString("es-CO")}
              </span>.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleBack}
            disabled={isSubmitting}
            className="w-1/3 py-4 bg-white text-stone-700 border border-stone-300 rounded-xl font-bold hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            disabled={!isFormValid || isSubmitting}
            className="w-2/3 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <span>Confirmar y Generar Factura</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}