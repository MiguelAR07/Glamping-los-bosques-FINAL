/**
 * Subcomponente: Paso 3 del Wizard de Reservas
 * Formulario de captura de datos personales del titular de la reserva.
 */
import { FileText } from "lucide-react";

export function BookingStep3Form({
  formData, setFormData, handleBack, handleCheckout, isMultiDay, dateRange, date, deposit
}: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-stone-900 mb-4">Tus Datos</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Nombre Completo</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Ej. Juan Pérez" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Correo Electrónico</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="juan@ejemplo.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Tipo de Documento</label>
          <select value={formData.documentType} onChange={e => setFormData({...formData, documentType: e.target.value})} className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
            <option value="C.C.">Cédula de Ciudadanía (C.C.)</option>
            <option value="C.E.">Cédula de Extranjería (C.E.)</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Nit">NIT</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Número de Documento</label>
          <input type="text" value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Número de identificación" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">País de Residencia</label>
          <select 
            value={formData.country} 
            onChange={e => setFormData({...formData, country: e.target.value})} 
            className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
          >
            <option value="Colombia">Colombia</option>
            <option value="Estados Unidos">Estados Unidos</option>
            <option value="España">España</option>
            <option value="México">México</option>
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
            <option value="Ecuador">Ecuador</option>
            <option value="Panamá">Panamá</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Canadá">Canadá</option>
            <option value="Brasil">Brasil</option>
            <option value="Reino Unido">Reino Unido</option>
            <option value="Francia">Francia</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Teléfono</label>
          <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="+57 300 000 0000" />
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-stone-200">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4 mb-6">
          <div className="bg-emerald-500 text-white p-2 rounded-lg shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">Confirmación de Reserva</h4>
            <p className="text-sm text-stone-600">Al continuar, se generará tu recibo de reserva. Para confirmar tu estadía, deberás abonar un anticipo del 50% ($ {deposit.toLocaleString('es-CO')}).</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handleBack} className="w-1/3 py-4 bg-white text-stone-700 border border-stone-300 rounded-xl font-bold hover:bg-stone-50 transition-colors">
            Volver
          </button>
          <button 
            onClick={handleCheckout} 
            disabled={!formData.name || !formData.email || !formData.phone || !formData.document || !formData.country || (isMultiDay ? (!dateRange.from || !dateRange.to) : !date)}
            className="w-2/3 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
          >
            <span>Generar Factura de Reserva</span>
          </button>
        </div>
      </div>
    </div>
  );
}
