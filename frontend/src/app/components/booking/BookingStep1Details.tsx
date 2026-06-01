/**
 * Subcomponente: Paso 1 del Wizard de Reservas
 * Renderiza la selección de cabaña, tipo de plan, fechas y número de huéspedes.
 * Cada plan restringe los días habilitados en el calendario:
 *   - "Semana"         → solo días de semana (Lun-Vie)
 *   - "Fin de Semana"  → solo sábados, domingos y festivos colombianos
 *   - "Ocasional"      → cualquier día + selector de bloque horario
 *   - "Día de sol"     → cualquier día, selector único
 */
import { Cabin, PlanType } from '../../types.ts'
import { DayPicker } from "react-day-picker";
import { es } from 'date-fns/locale';
import { isBefore, startOfDay, isSameDay, isWithinInterval, getDay } from 'date-fns';
import "react-day-picker/dist/style.css";

// ─────────────────────────────────────────────────────────────────────────────
// FESTIVOS COLOMBIANOS 2026 – 2027
// Ley Emiliani: los festivos que no caen en lunes se trasladan al lunes siguiente.
// ─────────────────────────────────────────────────────────────────────────────
const COLOMBIAN_HOLIDAYS: Date[] = [
  // 2026
  new Date(2026, 0, 1),   // Año Nuevo
  new Date(2026, 0, 12),  // Reyes Magos (trasladado)
  new Date(2026, 2, 23),  // San José (trasladado)
  new Date(2026, 3, 2),   // Jueves Santo
  new Date(2026, 3, 3),   // Viernes Santo
  new Date(2026, 4, 1),   // Día del Trabajo
  new Date(2026, 4, 18),  // Ascensión (trasladado)
  new Date(2026, 5, 8),   // Corpus Christi (trasladado)
  new Date(2026, 5, 15),  // Sagrado Corazón (trasladado)
  new Date(2026, 5, 29),  // San Pedro y San Pablo (trasladado)
  new Date(2026, 6, 20),  // Independencia (fijo)
  new Date(2026, 7, 7),   // Batalla de Boyacá (fijo)
  new Date(2026, 7, 17),  // La Asunción (trasladado)
  new Date(2026, 9, 12),  // Raza (trasladado)
  new Date(2026, 10, 2),  // Todos los Santos (trasladado)
  new Date(2026, 10, 16), // Independencia de Cartagena (trasladado)
  new Date(2026, 11, 8),  // Inmaculada Concepción (fijo)
  new Date(2026, 11, 25), // Navidad (fijo)
  // 2027
  new Date(2027, 0, 1),   // Año Nuevo
  new Date(2027, 0, 11),  // Reyes Magos (trasladado)
  new Date(2027, 2, 22),  // San José (trasladado)
  new Date(2027, 2, 25),  // Jueves Santo
  new Date(2027, 2, 26),  // Viernes Santo
  new Date(2027, 4, 1),   // Día del Trabajo
  new Date(2027, 4, 10),  // Ascensión (trasladado)
  new Date(2027, 5, 7),   // Corpus Christi (trasladado)
  new Date(2027, 5, 14),  // Sagrado Corazón (trasladado)
  new Date(2027, 5, 28),  // San Pedro y San Pablo (trasladado)
  new Date(2027, 6, 20),  // Independencia (fijo)
  new Date(2027, 7, 7),   // Batalla de Boyacá (fijo)
  new Date(2027, 7, 16),  // La Asunción (trasladado)
  new Date(2027, 9, 18),  // Raza (trasladado)
  new Date(2027, 10, 1),  // Todos los Santos (trasladado)
  new Date(2027, 10, 15), // Independencia de Cartagena (trasladado)
  new Date(2027, 11, 8),  // Inmaculada Concepción (fijo)
  new Date(2027, 11, 25), // Navidad (fijo)
];

/** Retorna true si la fecha es un festivo colombiano */
const isColombianoHoliday = (date: Date): boolean =>
  COLOMBIAN_HOLIDAYS.some((h) => isSameDay(date, h));

/** Retorna true si la fecha es sábado o domingo */
const isWeekend = (date: Date): boolean => {
  const day = getDay(date); // 0 = Dom, 6 = Sáb
  return day === 0 || day === 6;
};

/** Retorna true si la fecha es día de semana (Lun-Vie), NO festivo */
const isWeekday = (date: Date): boolean => {
  const day = getDay(date);
  return day >= 1 && day <= 5;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: identifica el tipo de plan a partir del nombre
// ─────────────────────────────────────────────────────────────────────────────
const getPlanCategory = (planName: string): 'weekend' | 'week' | 'occasional' | 'occasional_weekend' | 'sundayOrOther' => {
  const n = planName.toLowerCase();
  
  if (n.includes('ocasional') || n.includes('hora')) {
    if (n.includes('fin de semana') || n.includes('festivo') || n.includes('weekend')) {
      return 'occasional_weekend';
    }
    return 'occasional';
  }
  
  if (n.includes('fin de semana') || n.includes('festivo') || n.includes('weekend'))
    return 'weekend';
  if (n.includes('semana') && !n.includes('fin'))
    return 'week';
  return 'sundayOrOther';
};

export function BookingStep1Details({
  guests, setGuests, cabins,
  selectedCabinId, setSelectedCabinId,
  planType, setPlanType,
  selectedPlanTypeId, setSelectedPlanTypeId,
  planTypes,
  date, setDate,
  dateRange, setDateRange,
  timeBlock, setTimeBlock,
  isMultiDay, selectedCabin, handleNext
}: any) {
  const planCategory = getPlanCategory(planType);
  const isOccasional = planCategory === 'occasional' || planCategory === 'occasional_weekend';

  // ─── HINT visible bajo el calendario ──────────────────────────────────────
  const calendarHint: Record<typeof planCategory, string> = {
    weekend: '📅 Solo puedes seleccionar sábados, domingos y festivos colombianos.',
    week:    '📅 Solo puedes seleccionar días de semana (lunes a viernes).',
    occasional: '📅 Selecciona el día de tu visita y el bloque de horario.',
    occasional_weekend: '📅 Selecciona un sábado, domingo o festivo y tu bloque de horario.',
    sundayOrOther: '📅 Selecciona la fecha de tu llegada.',
  };

  // ─── FECHAS DESHABILITADAS ─────────────────────────────────────────────────
  const isDateDisabled = (d: Date): boolean => {
    // 1. Siempre bloquear el pasado
    if (isBefore(d, startOfDay(new Date()))) return true;

    // 2. Bloqueos específicos por cabaña / temporada
    const isPalmas = selectedCabin?.nombre?.toLowerCase().includes('palmas');
    if (isPalmas) {
      if (isSameDay(d, new Date(2026, 4, 25))) return true;
      if (isSameDay(d, new Date(2026, 4, 27))) return true;
    }
    if (isSameDay(d, new Date(2026, 4, 30))) return true;
    if (isWithinInterval(d, { start: new Date(2026, 5, 5), end: new Date(2026, 5, 11) })) return true;

    // 3. Restricciones por tipo de plan
    if (planCategory === 'weekend' || planCategory === 'occasional_weekend') {
      // Solo permitir fines de semana y festivos
      return !isWeekend(d) && !isColombianoHoliday(d);
    }
    if (planCategory === 'week') {
      // Solo permitir lunes a viernes (festivos también quedan bloqueados)
      return !isWeekday(d) || isColombianoHoliday(d);
    }

    return false; // Ocasional normal y Día de sol: cualquier día
  };

  return (
    <div className="space-y-8">
      <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-100 text-sm font-medium">
        ⚠️ Nota importante: No se alquilan cabañas a menores de edad si no vienen acompañados por sus padres.
      </div>

      {/* ── Selector de Cabaña ── */}
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
              <div className="text-xs text-stone-500 mt-1">Desde ${c.precio_noche.toLocaleString('es-CO')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Selector de Plan ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-3">Tipo de Plan</label>
        <div className="grid grid-cols-2 gap-3">
          {planTypes.map((pt: PlanType) => (
            <button
              key={pt.id}
              onClick={() => {
                setSelectedPlanTypeId(pt.id);
                setPlanType(pt.nombre);
                // Limpiar fechas al cambiar de plan para evitar selecciones inválidas
                setDate(undefined);
                setDateRange({ from: undefined, to: undefined });
              }}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                selectedPlanTypeId === pt.id
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-emerald-200"
              }`}
            >
              {pt.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* ── Calendario ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Fechas</label>
        <p className="text-xs text-stone-500 mb-3">{calendarHint[planCategory]}</p>
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex justify-center">
          {isMultiDay ? (
            <DayPicker
              locale={es}
              mode="range"
              selected={dateRange as any}
              onSelect={setDateRange as any}
              disabled={isDateDisabled}
              className="bg-transparent"
              classNames={{
                day_selected: "bg-emerald-600 text-white hover:bg-emerald-700",
                day_today: "font-bold text-emerald-600",
                day_disabled: "opacity-25 cursor-not-allowed",
              }}
            />
          ) : (
            <DayPicker
              locale={es}
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={isDateDisabled}
              className="bg-transparent"
              classNames={{
                day_selected: "bg-emerald-600 text-white hover:bg-emerald-700",
                day_today: "font-bold text-emerald-600",
                day_disabled: "opacity-25 cursor-not-allowed",
              }}
            />
          )}
        </div>

        {/* Leyenda de colores para Fin de Semana y Festivos */}
        {planCategory === 'weekend' && (
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-600" /> Seleccionado
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-stone-200 opacity-40" /> No disponible (día de semana)
            </span>
          </div>
        )}
        {planCategory === 'week' && (
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-600" /> Seleccionado
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-stone-200 opacity-40" /> No disponible (fin de semana / festivo)
            </span>
          </div>
        )}
      </div>

      {/* ── Bloque de horario (solo Ocasional) ── */}
      {isOccasional && (
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-3">Bloque de Horario</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["8:00 AM - 1:00 PM", "1:00 PM - 6:00 PM", "6:00 PM - 11:00 PM"].map(block => (
              <button
                key={block}
                onClick={() => setTimeBlock(block)}
                className={`p-3 rounded-xl border text-sm font-medium ${
                  timeBlock === block
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                }`}
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

      {/* ── Número de Huéspedes ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-3">
          Número de personas (Max. {selectedCabin.maxGuests})
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100"
          >-</button>
          <span className="text-xl font-medium w-6 text-center">{guests}</span>
          <button
            onClick={() => setGuests(Math.min(selectedCabin.maxGuests, guests + 1))}
            disabled={guests >= selectedCabin.maxGuests}
            className={`w-10 h-10 rounded-full border flex items-center justify-center ${
              guests >= selectedCabin.maxGuests
                ? 'opacity-50 cursor-not-allowed bg-stone-100 border-stone-200'
                : 'border-stone-300 hover:bg-stone-100'
            }`}
          >+</button>
        </div>
        {guests > 2 && selectedCabin.additionalPersonPrice > 0 && (
          <p className="text-xs text-stone-500 mt-2">
            Se aplica cobro por {guests - 2} persona(s) adicional(es) (${selectedCabin.additionalPersonPrice.toLocaleString('es-CO')} c/u)
          </p>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={isMultiDay ? (!dateRange.from || !dateRange.to) : (!date || (isOccasional && !timeBlock))}
        className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar a Extras
      </button>
    </div>
  );
}
