/**
 * Subcomponente: Paso 1 del Wizard de Reservas
 * Renderiza la selección de cabaña, tipo de plan, fechas y número de huéspedes.
 * Cada plan restringe los días habilitados en el calendario:
 *   - "Semana"         → solo días de semana (Lun-Vie)
 *   - "Fin de Semana"  → solo sábados, domingos y festivos colombianos
 *   - "Ocasional"      → cualquier día + selector de bloque horario
 *   - "Día de sol"     → cualquier día, selector único
 */
import { Cabin, PlanType, formatCOP } from '../../types.ts'
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

/** Retorna true si la fecha es considerada Fin de Semana (Viernes o Sábado) para check-in */
const isWeekendCheckin = (date: Date): boolean => {
  const day = getDay(date); // 5 = Vie, 6 = Sáb
  return day === 5 || day === 6;
};

/** Retorna true si la fecha es considerada Semana (Domingo a Jueves), NO festivo */
const isWeekdayCheckin = (date: Date): boolean => {
  const day = getDay(date);
  // 0 = Dom, 1 = Lun, 2 = Mar, 3 = Mié, 4 = Jue
  return day >= 0 && day <= 4;
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
  adults, setAdults,
  childrenCount, setChildrenCount,
  pets, setPets,
  guests, cabins,
  selectedCabinId, setSelectedCabinId,
  planType, setPlanType,
  selectedPlanTypeId, setSelectedPlanTypeId,
  planTypes,
  date, setDate,
  dateRange, setDateRange,
  timeBlock, setTimeBlock,
  isMultiDay, selectedCabin, handleNext, blockedDates,
  fixedDays, packagesList
}: any) {
  const planCategory = getPlanCategory(planType);
  const isOccasional = planCategory === 'occasional' || planCategory === 'occasional_weekend';

  // ─── HINT visible bajo el calendario ──────────────────────────────────────
  const calendarHint: Record<typeof planCategory, string> = {
    weekend: '📅 Solo puedes seleccionar viernes, sábados y festivos colombianos.',
    week:    '📅 Solo puedes seleccionar de domingo a jueves.',
    occasional: '📅 Selecciona el día de tu visita y el bloque de horario.',
    occasional_weekend: '📅 Selecciona un sábado, domingo o festivo y tu bloque de horario.',
    sundayOrOther: '📅 Selecciona la fecha de tu llegada.',
  };

  const handleRangeSelect = (range: any) => {
    if (!range) {
      setDateRange({ from: undefined, to: undefined });
      return;
    }
    if (fixedDays && fixedDays > 0 && range?.from) {
      // Si la promo tiene días de estadía fijos, configuramos la salida automáticamente
      const from = range.from;
      const to = new Date(from.getTime() + fixedDays * 24 * 60 * 60 * 1000);
      setDateRange({ from, to });
    } else {
      setDateRange(range);
    }
  };

  // ─── FECHAS DESHABILITADAS ─────────────────────────────────────────────────
  const isDateDisabled = (d: Date): boolean => {
    // 1. Siempre bloquear el pasado
    if (isBefore(d, startOfDay(new Date()))) return true;

    // 2. Bloqueos dinámicos desde la base de datos (Admin Panel)
    if (blockedDates && blockedDates.length > 0) {
      const isBlocked = blockedDates.some((b: any) => {
        // Aplica a todas las cabañas o a la seleccionada
        if (!b.cabana_id || String(b.cabana_id) === String(selectedCabinId) || b.cabana_id === "all") {
          const start = startOfDay(new Date(b.fecha_inicio));
          const end = startOfDay(new Date(b.fecha_fin));
          
          // Bloqueamos si el día D es mayor o igual a START y MENOR estricto que END
          // Esto permite que el día de salida (END) pueda ser seleccionado como día de entrada
          // por otro cliente.
          const current = startOfDay(d);
          return current.getTime() >= start.getTime() && current.getTime() < end.getTime();
        }
        return false;
      });
      if (isBlocked) return true;
    }

    // 3. Bloqueos específicos por cabaña / temporada (Hardcoded legacy)
    const isPalmas = selectedCabin?.nombre?.toLowerCase().includes('palmas');
    if (isPalmas) {
      if (isSameDay(d, new Date(2026, 4, 25))) return true;
      if (isSameDay(d, new Date(2026, 4, 27))) return true;
    }
    if (isSameDay(d, new Date(2026, 4, 30))) return true;
    if (isWithinInterval(d, { start: new Date(2026, 5, 5), end: new Date(2026, 5, 11) })) return true;

    // 4. Restricciones por tipo de plan
    // Comportamiento base (para check-in)
    let isBaseDisabled = false;
    if (planCategory === 'weekend' || planCategory === 'occasional_weekend') {
      isBaseDisabled = !isWeekendCheckin(d) && !isColombianoHoliday(d);
    } else if (planCategory === 'week') {
      isBaseDisabled = !isWeekdayCheckin(d) || isColombianoHoliday(d);
    }

    // Si hay un 'from' seleccionado, evaluamos las reglas de rango para fechas posteriores a 'from'
    if (dateRange?.from) {
      const daysDiff = (startOfDay(d).getTime() - startOfDay(dateRange.from).getTime()) / (1000 * 60 * 60 * 24);
      
      // Si es una fecha posterior al check-in (buscando checkout o ya seleccionado)
      if (daysDiff > 0) {
        if (planCategory === 'weekend' || planCategory === 'occasional_weekend') {
          // Máximo 3 noches, permitir checkout en días deshabilitados para check-in
          return daysDiff > 3;
        }
        if (planCategory === 'week') {
          // Máximo 5 noches, no cruzar fin de semana
          if (daysDiff > 5) return true;
          
          // No se puede hacer checkout el sábado (implica noche de viernes) ni domingo (noche de sábado)
          // Pero SÍ se puede el viernes (noche de jueves)
          const checkOutDay = getDay(d);
          if (checkOutDay === 6 || checkOutDay === 0) return true;
          
          return false;
        }
      }
      // Si es anterior o igual a 'from', usamos la regla base (para poder reiniciar la selección)
      return isBaseDisabled;
    }

    return isBaseDisabled;
  };

  return (
    <div className="space-y-8">
      <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-100 text-sm font-medium">
        ⚠️ Nota importante: No se alquilan cabañas a menores de edad si no vienen acompañados por sus padres.
      </div>

      {/* ── 1. Selector de Plan (primero, porque define el calendario) ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-3">1. Tipo de Plan</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {planTypes.map((pt: PlanType) => {
            let planPrice = 0;
            if ((pt as any).isPromo && (pt as any).precio_promocional) {
              planPrice = Number((pt as any).precio_promocional);
            } else if (packagesList && packagesList.length > 0) {
              const match = packagesList.find(
                (pkg: any) => String(pkg.cabana_id) === String(selectedCabinId) && String(pkg.tipo_id) === String(pt.id)
              );
              if (match && match.precio > 0) {
                planPrice = Number(match.precio);
              }
            }
            if (planPrice === 0 && selectedCabin) {
              planPrice = Number(selectedCabin.precio_noche || 0);
            }

            return (
              <button
                key={pt.id}
                onClick={() => {
                  setSelectedPlanTypeId(pt.id);
                  setPlanType(pt.nombre);
                  // Limpiar fechas al cambiar de plan para evitar selecciones inválidas
                  setDate(undefined);
                  setDateRange({ from: undefined, to: undefined });
                  setTimeBlock('');
                }}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedPlanTypeId === pt.id
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-emerald-200"
                }`}
              >
                <div>
                  <div className="font-bold text-base">{pt.nombre.toLowerCase().includes('ocasional') && !pt.nombre.includes('6 horas') && !pt.nombre.toLowerCase().includes('promo') ? `${pt.nombre} (6 horas)` : pt.nombre}</div>
                  <div className="text-xs font-normal mt-1 opacity-85 leading-relaxed">
                    {pt.nombre.toLowerCase().includes('sol') ? 'Uso de instalaciones de 10am a 5pm, sin pernoctar.' :
                     pt.nombre.toLowerCase().includes('ocasional') ? 'Estadía corta de 6 horas, ideal para escapar un rato.' :
                     pt.nombre.toLowerCase().includes('semana') && !pt.nombre.toLowerCase().includes('fin') ? 'Aplica de Domingo a Jueves. Perfecto para desconectarse.' :
                     pt.nombre.toLowerCase().includes('fin de semana') || pt.nombre.toLowerCase().includes('festivo') ? 'Aplica Viernes, Sábados y Festivos. Relajación total.' :
                     'Disfruta de la mejor experiencia.'}
                  </div>
                </div>
                {planPrice > 0 && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedPlanTypeId === pt.id
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs"
                    }`}>
                      ${formatCOP(planPrice)} COP
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Selector de Cabaña ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-stone-700">2. Selecciona tu Cabaña</label>
          <span className="text-xs text-stone-400 font-normal">Puedes cambiar de cabaña en cualquier momento</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cabins.map((c: Cabin) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCabinId(c.id);
                if (guests > c.maxGuests) {
                  setAdults(c.maxGuests);
                  setChildrenCount(0);
                }
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedCabinId === c.id
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-stone-200 bg-white hover:border-emerald-200'
              }`}
            >
              <div className="font-bold text-stone-900">{c.nombre}</div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">Desde ${formatCOP(c.precio_noche)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Calendario ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          3. {isMultiDay ? 'Fechas de Estadía' : 'Fecha de tu Visita'}
        </label>
        <p className="text-xs text-stone-500 mb-3">{calendarHint[planCategory]}</p>
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex justify-center">
          {isMultiDay || (fixedDays && fixedDays > 0) ? (
            <DayPicker
              locale={es}
              mode={fixedDays && fixedDays > 0 ? "single" : "range"}
              selected={fixedDays && fixedDays > 0 ? dateRange.from : (dateRange as any)}
              onSelect={fixedDays && fixedDays > 0 ? ((d: Date | undefined) => handleRangeSelect({from: d})) : (handleRangeSelect as any)}
              disabled={isDateDisabled}
              className="bg-transparent"
              classNames={{
                selected: "!bg-emerald-600 !text-white hover:!bg-emerald-700",
                today: "font-bold text-emerald-600",
                disabled: "opacity-25 cursor-not-allowed",
              }}
              required={false}
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
                selected: "!bg-emerald-600 !text-white hover:!bg-emerald-700",
                today: "font-bold text-emerald-600",
                disabled: "opacity-25 cursor-not-allowed",
              }}
              required={false}
            />
          )}
        </div>

        {/* Alerta: selecciona fecha de salida */}
        {isMultiDay && dateRange.from && (!dateRange.to || dateRange.from.getTime() === dateRange.to.getTime()) && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium animate-pulse">
            📅 ¡Ahora selecciona tu <strong>fecha de salida</strong> en el calendario!
          </div>
        )}

        {/* Alerta: límite de noches por tipo de plan */}
        {isMultiDay && planCategory === 'weekend' && (
          <div className="mt-2 p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600">
            ⚠️ Plan Fin de Semana / Festivo: máximo <strong>3 noches</strong> por reserva.
          </div>
        )}
        {isMultiDay && planCategory === 'week' && (
          <div className="mt-2 p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600">
            ⚠️ Plan Semana: máximo <strong>5 noches</strong> por reserva.
          </div>
        )}

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

      {/* ── 4. Bloque de horario (solo Ocasional) ── */}
      {isOccasional && (
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-3">4. Bloque de Horario</label>
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

      {/* ── 5. Número de Huéspedes y Mascotas ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-3">
          {isOccasional ? '5' : '4'}. Huéspedes y Mascotas (Máx {selectedCabin?.maxGuests || 4} personas)
        </label>
        
        <div className="space-y-4">
          {/* Adultos */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-stone-900">Adultos y Niños mayores a 3 años</div>
              <div className="text-xs text-stone-500">A partir de 3 personas: +$70.000 c/u</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100"
              >-</button>
              <span className="text-xl font-medium w-6 text-center">{adults}</span>
              <button
                onClick={() => setAdults(Math.min(selectedCabin?.maxGuests || 4, adults + 1))}
                disabled={adults >= (selectedCabin?.maxGuests || 4) || (!(selectedCabin?.id === 'roble' || selectedCabin?.nombre?.toLowerCase().includes('roble')) && guests >= (selectedCabin?.maxGuests || 4))}
                className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                  adults >= (selectedCabin?.maxGuests || 4) || (!(selectedCabin?.id === 'roble' || selectedCabin?.nombre?.toLowerCase().includes('roble')) && guests >= (selectedCabin?.maxGuests || 4))
                    ? 'opacity-50 cursor-not-allowed bg-stone-100 border-stone-200'
                    : 'border-stone-300 hover:bg-stone-100'
                }`}
              >+</button>
            </div>
          </div>

          {/* Niños */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-stone-900">Niños menores a 3 años</div>
              <div className="text-xs text-stone-500">No pagan adicional</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100"
              >-</button>
              <span className="text-xl font-medium w-6 text-center">{childrenCount}</span>
              <button
                onClick={() => setChildrenCount(Math.min((selectedCabin?.id === 'roble' || selectedCabin?.nombre?.toLowerCase().includes('roble')) ? 1 : (selectedCabin?.maxGuests || 4), childrenCount + 1))}
                disabled={((selectedCabin?.id === 'roble' || selectedCabin?.nombre?.toLowerCase().includes('roble')) && childrenCount >= 1) || (!(selectedCabin?.id === 'roble' || selectedCabin?.nombre?.toLowerCase().includes('roble')) && guests >= (selectedCabin?.maxGuests || 4))}
                className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                  ((selectedCabin?.id === 'roble' || selectedCabin?.nombre?.toLowerCase().includes('roble')) && childrenCount >= 1) || (!(selectedCabin?.id === 'roble' || selectedCabin?.nombre?.toLowerCase().includes('roble')) && guests >= (selectedCabin?.maxGuests || 4))
                    ? 'opacity-50 cursor-not-allowed bg-stone-100 border-stone-200'
                    : 'border-stone-300 hover:bg-stone-100'
                }`}
              >+</button>
            </div>
          </div>

          {/* Mascotas */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-stone-900">Mascotas</div>
              <div className="text-xs text-stone-500">+$30.000 adicional</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPets(Math.max(0, pets - 1))}
                className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100"
              >-</button>
              <span className="text-xl font-medium w-6 text-center">{pets}</span>
              <button
                onClick={() => setPets(pets + 1)}
                className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100"
              >+</button>
            </div>
          </div>
        </div>

        {adults > 2 && selectedCabin?.additionalPersonPrice > 0 && (
          <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-4 font-medium border border-emerald-100">
            Se aplica cobro por {adults - 2} adulto(s) adicional(es) (${formatCOP(selectedCabin.additionalPersonPrice)} c/u)
          </p>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={isMultiDay ? (!dateRange.from || !dateRange.to || dateRange.from.getTime() === dateRange.to.getTime()) : (!date || (isOccasional && !timeBlock))}
        className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar a Extras
      </button>
    </div>
  );
}
