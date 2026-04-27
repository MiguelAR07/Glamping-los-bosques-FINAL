import { useState, useMemo } from "react";
import { CABINS, SERVICES } from "../data";
import { differenceInDays } from "date-fns";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Subcomponentes
import { BookingStep1Details } from "./booking/BookingStep1Details";
import { BookingStep2Extras } from "./booking/BookingStep2Extras";
import { BookingStep3Form } from "./booking/BookingStep3Form";
import { BookingSummarySidebar } from "./booking/BookingSummarySidebar";

/**
 * Componente del Asistente de Reservas (Wizard)
 * Maneja el estado y los cálculos matemáticos. La interfaz gráfica se delega a los subcomponentes.
 */
export function BookingSection() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCabinId, setSelectedCabinId] = useState<string>("palmas");
  const [planType, setPlanType] = useState<"week" | "weekend" | "sun_day" | "occasional">("week");
  const [timeBlock, setTimeBlock] = useState<string>("");
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{from: Date | undefined; to: Date | undefined}>({ from: new Date(), to: undefined });
  
  const [guests, setGuests] = useState(2);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", documentType: "C.C.", document: "", country: "Colombia"
  });

  const selectedCabin = CABINS.find(c => c.id === selectedCabinId) || CABINS[0];

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // --- LÓGICA DE CÁLCULO ---
  const isMultiDay = planType === "week" || planType === "weekend";
  
  const nights = useMemo(() => {
    if (isMultiDay && dateRange.from && dateRange.to) {
      const days = differenceInDays(dateRange.to, dateRange.from);
      return Math.max(1, days);
    }
    return 1;
  }, [dateRange, isMultiDay]);

  const cabinPrice = selectedCabin.plans[planType] * nights;
  const extraGuests = Math.max(0, guests - 2);
  const extraGuestsPrice = extraGuests * (selectedCabin.additionalPersonPrice || 0) * nights;
  
  const servicesTotal = selectedServices.reduce((acc, serviceId) => {
    const service = SERVICES.find(s => s.id === serviceId);
    return acc + (service?.price || 0);
  }, 0);

  const subtotal = cabinPrice + extraGuestsPrice + servicesTotal;
  const deposit = subtotal * 0.5;

  // --- NAVEGACIÓN ---
  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleCheckout = () => {
    navigate("/confirmacion", {
      state: {
        cabin: selectedCabin,
        planType,
        dateRange: isMultiDay ? dateRange : { from: date, to: date },
        timeBlock: planType === "occasional" ? timeBlock : null,
        guests,
        services: selectedServices.map(id => SERVICES.find(s => s.id === id)),
        total: subtotal,
        deposit,
        formData
      }
    });
  };

  return (
    <section id="booking" className="py-24 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Reserva tu experiencia</h2>
            <div className="flex items-center gap-2 text-sm font-medium text-stone-500">
              <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100'}`}>1. Detalles</span>
              <ChevronRight className="w-4 h-4" />
              <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100'}`}>2. Extras</span>
              <ChevronRight className="w-4 h-4" />
              <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100'}`}>3. Datos y Pago</span>
            </div>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm"
          >
            {step === 1 && (
              <BookingStep1Details 
                guests={guests} setGuests={setGuests}
                selectedCabinId={selectedCabinId} setSelectedCabinId={setSelectedCabinId}
                planType={planType} setPlanType={setPlanType}
                date={date} setDate={setDate}
                dateRange={dateRange} setDateRange={setDateRange}
                timeBlock={timeBlock} setTimeBlock={setTimeBlock}
                isMultiDay={isMultiDay} selectedCabin={selectedCabin} handleNext={handleNext}
              />
            )}
            {step === 2 && (
              <BookingStep2Extras 
                selectedServices={selectedServices} toggleService={toggleService}
                handleNext={handleNext} handleBack={handleBack}
              />
            )}
            {step === 3 && (
              <BookingStep3Form 
                formData={formData} setFormData={setFormData}
                handleBack={handleBack} handleCheckout={handleCheckout}
                isMultiDay={isMultiDay} dateRange={dateRange} date={date} deposit={deposit}
              />
            )}
          </motion.div>
        </div>

        <BookingSummarySidebar 
          selectedCabin={selectedCabin} planType={planType} dateRange={dateRange}
          date={date} isMultiDay={isMultiDay} nights={nights} timeBlock={timeBlock}
          guests={guests} cabinPrice={cabinPrice} extraGuests={extraGuests} 
          extraGuestsPrice={extraGuestsPrice} selectedServices={selectedServices}
          subtotal={subtotal} deposit={deposit}
        />
      </div>
    </section>
  );
}
