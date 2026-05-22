import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AppLayout } from "./app/components/AppLayout";
import { Home } from "./app/pages/Home";

// Rutas con carga diferida (lazy loading) para optimizar el rendimiento
const Reservas = lazy(() => import("./app/pages/Reservas").then(module => ({ default: module.Reservas })));
const BookingConfirmation = lazy(() => import("./app/components/BookingConfirmation").then(module => ({ default: module.BookingConfirmation })));

// Interfaz de respaldo temporal para la carga diferida
const LoadingScreen = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin"></div>
  </div>
);

// Enrutador principal de la aplicación
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/confirmacion" element={<BookingConfirmation />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
