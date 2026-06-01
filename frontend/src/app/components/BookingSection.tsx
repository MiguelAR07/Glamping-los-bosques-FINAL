import { useState, useMemo, useEffect } from "react";
import { differenceInDays } from "date-fns";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

import { BookingStep1Details } from "./booking/BookingStep1Details";
import { BookingStep2Extras } from "./booking/BookingStep2Extras";
import { BookingStep3Form } from "./booking/BookingStep3Form";
import { BookingSummarySidebar } from "./booking/BookingSummarySidebar";

import { Cabin, Service, BookingPayload, PlanType } from "../types.ts";
import { createReservation, getCabins, getServices, getPackageTypes } from "../api.ts";

export function BookingSection() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [planTypes, setPlanTypes] = useState<PlanType[]>([]);
  const [selectedCabinId, setSelectedCabinId] = useState<string>("");
  const [selectedPlanTypeId, setSelectedPlanTypeId] = useState<number>(0);
  const [planType, setPlanType] = useState<string>("");
  const [timeBlock, setTimeBlock] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: undefined,
  });
  const [guests, setGuests] = useState(2);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    documentType: "C.C.",
    document: "",
    country: "Colombia",
  });

  const selectedCabin = useMemo(() => {
    return cabins.find((c) => c.id === selectedCabinId) || cabins[0];
  }, [cabins, selectedCabinId]);

  const [searchParams] = useSearchParams();
  const urlCabinId = searchParams.get("cabin");
  const urlPromo = searchParams.get("promo");

  useEffect(() => {
    if (cabins.length > 0 && urlCabinId) {
      const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const matchedCabin = cabins.find(
        (c: any) => String(c.id) === String(urlCabinId) || normalize(c.nombre || "").includes(normalize(urlCabinId))
      );
      if (matchedCabin && matchedCabin.id !== selectedCabinId) {
        setSelectedCabinId(matchedCabin.id);
      }
    }
  }, [urlCabinId, cabins, selectedCabinId]);

  useEffect(() => {
    if (planTypes.length > 0 && urlPromo === "true") {
      const promoPlan = planTypes.find((p: any) => p.isPromo);
      if (promoPlan && promoPlan.id !== selectedPlanTypeId) {
        setSelectedPlanTypeId(promoPlan.id);
        setPlanType(promoPlan.nombre);
      }
    }
  }, [urlPromo, planTypes, selectedPlanTypeId]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargamos cabañas, servicios y tipos de plan en paralelo.
        // Las promociones se cargan de forma independiente para que si el endpoint falla,
        // no bloquee la carga principal de las cabañas.
        const [loadedCabins, loadedServices, loadedPlanTypes] = await Promise.all([
          getCabins(),
          getServices(),
          getPackageTypes(),
        ]);

        // Intentamos cargar las promociones sin bloquear lo demás
        let activePromos: any[] = [];
        try {
          const resPromos = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/promociones`).then(res => {
            if (!res.ok) throw new Error('Promociones no disponibles');
            return res.json();
          });
          activePromos = resPromos
            .filter((p: any) => p.estado?.toLowerCase() === "activo")
            .map((p: any) => ({
              id: `promo_${p.id}`,
              nombre: `🌟 Promoción: ${p.nombre}`,
              isPromo: true,
              precio_promocional: p.precio,
              cabanas_permitidas: p.cabanas.map((c: any) => String(c.id))
            }));
        } catch {
          // Si el endpoint de promociones falla, simplemente no mostramos promos
          console.warn("No se pudieron cargar las promociones.");
        }

        const combinedPlanTypes = [...loadedPlanTypes, ...activePromos];

        setCabins(loadedCabins);
        setServices(loadedServices);
        setPlanTypes(combinedPlanTypes);

        // Setear por defecto la primera cabaña o la de la URL:
        if (urlCabinId) {
          const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          const matchedCabin = loadedCabins.find((c: any) => String(c.id) === String(urlCabinId) || normalize(c.nombre || "").includes(normalize(urlCabinId)));
          if (matchedCabin) {
            setSelectedCabinId(matchedCabin.id);
          } else if (loadedCabins.length > 0) {
            setSelectedCabinId(loadedCabins[0].id);
          }
        } else if (loadedCabins.length > 0) {
          setSelectedCabinId(loadedCabins[0].id);
        }

        // Setear por defecto el tipo de plan de la URL promo o el primero:
        if (urlPromo === "true" && combinedPlanTypes.some((p: any) => p.isPromo)) {
          const promoPlan = combinedPlanTypes.find((p: any) => p.isPromo);
          setSelectedPlanTypeId(promoPlan.id);
          setPlanType(promoPlan.nombre);
        } else if (loadedPlanTypes.length > 0) {
          setSelectedPlanTypeId(loadedPlanTypes[0].id);
          setPlanType(loadedPlanTypes[0].nombre);
        }
      } catch (error) {
        console.error("Error cargando datos de reserva:", error);
      }
    };
    loadInitialData();
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // --- LÓGICA DE CÁLCULO ---
  // isMultiDay: los planes "Semana" y "Fin de Semana / Festivo" usan selector de rango
  const planNameLower = planType.toLowerCase();
  const isMultiDay =
    !planNameLower.includes('ocasional') &&
    (planNameLower.includes('semana') ||
     planNameLower.includes('fin de semana') ||
     planNameLower.includes('festivo') ||
     planNameLower.includes('weekend'));

  const nights = useMemo(() => {
    if (isMultiDay && dateRange.from && dateRange.to) {
      const days = differenceInDays(dateRange.to, dateRange.from);
      return Math.max(1, days);
    }
    return 1;
  }, [dateRange, isMultiDay]);

  const selectedPlanObj = useMemo(() => planTypes.find(p => p.id === selectedPlanTypeId) as any, [planTypes, selectedPlanTypeId]);

  const basePrice = selectedPlanObj?.isPromo ? Number(selectedPlanObj.precio_promocional) : (selectedCabin?.precio_noche || 0);

  // Filtrar cabañas basado en la promoción seleccionada
  const filteredCabins = useMemo(() => {
    if (selectedPlanObj?.isPromo && selectedPlanObj.cabanas_permitidas?.length > 0) {
      return cabins.filter(c => selectedPlanObj.cabanas_permitidas.includes(String(c.id)));
    }
    return cabins;
  }, [cabins, selectedPlanObj]);

  // Si la cabaña seleccionada ya no es válida por el filtro, seleccionar la primera válida
  useEffect(() => {
    if (filteredCabins.length > 0 && !filteredCabins.find(c => c.id === selectedCabinId)) {
      setSelectedCabinId(filteredCabins[0].id);
    }
  }, [filteredCabins, selectedCabinId]);
  const cabinPrice = basePrice * nights;
  const extraGuests = Math.max(0, guests - 2);
  const extraGuestsPrice =
    extraGuests * (selectedCabin?.additionalPersonPrice || 0) * nights;

  const servicesTotal = selectedServices.reduce((acc, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return acc + (service?.precio || 0);
  }, 0);

  const subtotal = cabinPrice + extraGuestsPrice + servicesTotal;
  const deposit = subtotal * 0.5;

  // --- NAVEGACIÓN ---
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleCheckout = async () => {
    setErrors({});
    try {
      // 1. Usamos el tipo de plan seleccionado directamente
      const dbTipoId = selectedPlanTypeId;

      // 2. Preparamos el payload con la estructura requerida, incluyendo el objeto paquete
      const bookingData: BookingPayload = {
        cliente: {
          nombre: formData.name,
          email: formData.email,
          contacto: formData.phone,
          numero_identificacion: formData.document,
          pais_residencia: formData.country,
          tipo_identificacion: formData.documentType,
        },
        reserva: {
          paquete_id: "", // Se deja vacío para que el backend cree el paquete e inserte su ID generado
          cliente_id: "", // Se genera en la transacción del backend
          plan_type: planType,
          llegada: isMultiDay ? (dateRange.from as Date).toISOString() : (date as Date).toISOString(),
          salida: isMultiDay ? (dateRange.to as Date).toISOString() : (date as Date).toISOString(),
          por_pagar: subtotal - deposit,
        },
        factura: {
          reserva_id: "",
          subtotal: subtotal,
          descuento: 0,
        },
        paquete: {
          nombre: `Reserva - ${selectedCabin ? selectedCabin.nombre : "Cabaña"}`,
          cabana_id: Number(selectedCabinId),
          dias_estadia: nights,
          descripcion: `Paquete ${selectedCabin ? selectedCabin.nombre : "Cabaña"} - Plan ${planType}`,
          tipo_id: dbTipoId
        }
      };
      
      // 3. Llamamos a la API (Transacción MVC)
      const response = await createReservation(bookingData);

      // 4. Navegación al éxito — se pasan todos los datos que necesita BookingConfirmation
      navigate("/confirmacion", {
        state: {
          reservaId: response.reserva_id,
          facturaId: response.factura_id,
          // Objeto cabaña completo (nombre + imagen)
          cabin: {
            name: selectedCabin.nombre,
            img_url: selectedCabin.img_url && selectedCabin.img_url.length > 0
              ? selectedCabin.img_url[0]
              : null,
          },
          // Datos del formulario como objeto
          formData: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            documentType: formData.documentType,
            document: formData.document,
            country: formData.country,
          },
          total: subtotal,
          deposit: deposit,
          dateRange: isMultiDay ? dateRange : { from: date, to: date },
          planType: planType,
          guests: guests,
        },
      });

    } catch (error: any) {
        console.log("Error recibido del server:", error);

        if (error.errors) {
          const errorMap: Record<string, string> = {};
          
          error.errors.forEach((err: any) => {
            errorMap[err.field] = err.message;
          });

          setErrors(errorMap);
      } else {
          alert(error.message || "Ocurrió un error inesperado");
        }
    }
  };

  if (cabins.length === 0) {
    return (
      <section id="booking" className="py-24 px-4 sm:px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-stone-500">Cargando cabañas...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">
              Reserva tu experiencia
            </h2>
            <div className="flex items-center gap-2 text-sm font-medium text-stone-500">
              <span
                className={`px-3 py-1 rounded-full ${
                  step >= 1
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100"
                }`}
              >
                1. Detalles
              </span>
              <ChevronRight className="w-4 h-4" />
              <span
                className={`px-3 py-1 rounded-full ${
                  step >= 2
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100"
                }`}
              >
                2. Extras
              </span>
              <ChevronRight className="w-4 h-4" />
              <span
                className={`px-3 py-1 rounded-full ${
                  step >= 3
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100"
                }`}
              >
                3. Datos y Pago
              </span>
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
                guests={guests}
                setGuests={setGuests}
                cabins={filteredCabins}
                selectedCabinId={selectedCabinId}
                setSelectedCabinId={setSelectedCabinId}
                planType={planType}
                setPlanType={setPlanType}
                selectedPlanTypeId={selectedPlanTypeId}
                setSelectedPlanTypeId={setSelectedPlanTypeId}
                planTypes={planTypes}
                date={date}
                setDate={setDate}
                dateRange={dateRange}
                setDateRange={setDateRange}
                timeBlock={timeBlock}
                setTimeBlock={setTimeBlock}
                isMultiDay={isMultiDay}
                selectedCabin={selectedCabin}
                handleNext={handleNext}
              />
            )}
            {step === 2 && (
              <BookingStep2Extras
                services={services}
                selectedServices={selectedServices}
                toggleService={toggleService}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
            {step === 3 && (
              <BookingStep3Form
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                handleBack={handleBack}
                handleCheckout={handleCheckout}
                isMultiDay={isMultiDay}
                dateRange={dateRange}
                date={date}
                deposit={deposit}
              />
            )}
          </motion.div>
        </div>

        <BookingSummarySidebar
          selectedCabin={selectedCabin}
          planType={planType}
          planName={planType}
          dateRange={dateRange}
          date={date}
          isMultiDay={isMultiDay}
          nights={nights}
          timeBlock={timeBlock}
          guests={guests}
          cabinPrice={cabinPrice}
          extraGuests={extraGuests}
          extraGuestsPrice={extraGuestsPrice}
          selectedServices={selectedServices}
          services={services}
          subtotal={subtotal}
          deposit={deposit}
        />
      </div>
    </section>
  );
}