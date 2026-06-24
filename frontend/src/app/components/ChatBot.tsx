import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
};

const FAQS = [
  { id: '1', question: '1. Horarios' },
  { id: '2', question: '2. Mascotas' },
  { id: '3', question: '3. Precios' },
  { id: '4', question: '4. Reservas' },
  { id: '5', question: '5. Ubicación' },
  { id: '6', question: '6. Servicios' },
  { id: '7', question: '7. Contacto' }
];

const getFAQResponse = (text: string, cuentasBancarias: any[] = []): string => {
  const normalized = text.toLowerCase().trim();
  
  if (normalized === '1') {
    return `🕒 **Horarios de Check-in y Check-out:**\n\n• **Check-in:** 3:00 PM\n• **Check-out:** 1:00 PM`;
  }
  if (normalized === '2') {
    return `🐶 **Mascotas (Pet Friendly):**\n\nSí, se permiten mascotas con un costo adicional de **$50.000** por estadía.`;
  }
  if (normalized === '3') {
    return `💸 **Precios y Planes por Cabaña:**\n\nManejamos diferentes planes según la cabaña que elijas:\n\n🏡 **Cabañas Palmas y Bambú** (Capacidad máx. 4 y 3 personas respectivamente):\n• **Plan Ocasional** (6 horas): **$160.000 COP**\n• **Plan Día de Sol** (Pasadía 10:00 AM - 5:00 PM): **$220.000 COP**\n• **Plan Hospedaje Semana** (Lunes a Jueves, por noche): **$280.000 COP**\n• **Plan Hospedaje Fin de Semana** (Viernes a Domingo / Festivos, por noche): **$350.000 COP**\n*(Tarifa base para 2 personas. Persona adicional: $70.000 COP por noche)*\n\n🏡 **Cabaña Roble** (Exclusiva para parejas - Capacidad máx. 2 personas):\n• **Plan Ocasional** (6 horas): **$150.000 COP**\n• **Plan Día de Sol** (Pasadía 10:00 AM - 5:00 PM): **$180.000 COP**\n• **Plan Hospedaje Semana** (Lunes a Jueves, por noche): **$250.000 COP**\n• **Plan Hospedaje Fin de Semana** (Viernes a Domingo / Festivos, por noche): **$290.000 COP**\n\n*Nota: Todos los hospedajes y días de sol incluyen el acceso al jacuzzi privado y las comodidades descritas en cada cabaña.*`;
  }
  if (normalized === '4') {
    let metodosTexto = "";
    if (cuentasBancarias.length > 0) {
      metodosTexto = cuentasBancarias.map(c => `   • **${c.banco} (${c.tipo_cuenta}):** ${c.numero_cuenta} ${c.titular ? `(${c.titular})` : ''}`).join('\n');
    } else {
      metodosTexto = `   • **Bancolombia (Ahorros):** 123-456789-00 (Glamping Los Bosques SAS)\n   • **Nequi:** 310 359 9065`;
    }
    
    return `📅 **¿Cómo reservar paso a paso?**\n\nReservar es muy sencillo y lo puedes hacer directamente desde nuestra plataforma:\n\n1️⃣ **Ingresa a la sección de Reservas:** Ve a la pestaña **"Reservas"** en el menú de navegación superior.\n2️⃣ **Elige los detalles:** Selecciona la cabaña (Palmas, Bambú o Roble), el tipo de plan, las fechas de tu estadía y la cantidad de huéspedes.\n3️⃣ **Selecciona servicios adicionales (opcional):** Puedes agregar decoraciones especiales de cumpleaños o aniversario si lo deseas.\n4️⃣ **Completa tus datos:** Llena el formulario con tu nombre, teléfono y documento de identidad.\n5️⃣ **Realiza el pago del anticipo:** Para asegurar tu reserva, debes transferir el **50% del valor total** a través de:\n${metodosTexto}\n6️⃣ **Sube tu comprobante:** Toma una captura de pantalla del pago y súbela en el paso final de la página de reservas.\n7️⃣ **¡Listo!** Verificaremos tu pago y te enviaremos la confirmación oficial a tu correo.`;
  }
  if (normalized === '5') {
    return `📍 **Ubicación:**\n\nEstamos ubicados en **Marinilla, Antioquia**, a 10 minutos del parque principal en carro. ¡Un paraíso rodeado de naturaleza!`;
  }
  if (normalized === '6') {
    return `🍽️ **Servicios (Restaurante y Transporte):**\n\n• **Servicio de restaurante:** Las comidas se venden siempre y cuando el administrador confirme que hay servicio para ese día. Consúltanos antes de tu llegada para coordinar tu alimentación.\n• **Servicio de transporte:** Para coordinar el servicio de transporte, por favor comunícate directamente al número:\n📞 **314822970**`;
  }
  if (normalized === '7') {
    return `📞 **Contacto:**\n\nPara dudas adicionales, comunícate con nosotros vía WhatsApp al:\n📱 **310 359 9065**`;
  }
  
  return `❌ **Opción no válida.**\n\nPor favor, escribe un número del **1 al 7** o escoge una de las siguientes opciones:\n\n1️⃣ Horarios de Check-in/out\n2️⃣ Mascotas (Pet Friendly)\n3️⃣ Precios de cabañas\n4️⃣ Reservas paso a paso\n5️⃣ Ubicación\n6️⃣ Servicios (Restaurante/Transporte)\n7️⃣ Contacto (WhatsApp)`;
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '¡Hola! Soy el asistente virtual de Glamping Los Bosques 🌲.\n\nSelecciona una pregunta escribiendo su número (1, 2, 3, 4, 5, 6, 7) o haz clic en los botones de abajo:\n\n1️⃣ Horarios de Check-in/out\n2️⃣ Mascotas (Pet Friendly)\n3️⃣ Precios de cabañas\n4️⃣ Reservas paso a paso\n5️⃣ Ubicación\n6️⃣ Servicios (Restaurante/Transporte)\n7️⃣ Contacto (WhatsApp)'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [cuentasBancarias, setCuentasBancarias] = useState<any[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        let API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://backend-landing-x76z.onrender.com';
        if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" && API_BASE_URL.includes("localhost")) API_BASE_URL = "https://backend-landing-x76z.onrender.com";
        const response = await fetch(`${API_BASE_URL}/api/cuentas-bancarias`);
        if (response.ok) {
          const data = await response.json();
          setCuentasBancarias(data);
        }
      } catch (err) {
        console.error("Error cargando cuentas bancarias:", err);
      }
    };
    fetchCuentas();
  }, []);
  
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsgId = Date.now().toString();
    const newMessages: Message[] = [...messages, { id: userMsgId, sender: 'user', text }];
    setMessages(newMessages);
    
    setIsTyping(true);
    // Simular tiempo de respuesta de 600ms para realismo
    setTimeout(() => {
      const normalized = text.toLowerCase().trim();
      if (normalized === '7') {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: 'Abriendo WhatsApp para que hables directamente con nosotros...' }]);
        window.open('https://wa.me/573103599065', '_blank');
      } else {
        const responseText = getFAQResponse(text, cuentasBancarias);
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: responseText }]);
      }
      setIsTyping(false);
    }, 600);
  };
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue;
    setInputValue('');
    handleSendMessage(text);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-500 hover:scale-110 transition-all z-50 ${isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}`}
        aria-label="Abrir chat de preguntas frecuentes"
      >
        <MessageCircle size={28} />
      </button>
      
      {/* Ventana de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-80 sm:w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
            style={{ maxHeight: 'calc(100vh - 100px)', height: '600px' }}
          >
            {/* Header */}
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Asistente de Glamping</h3>
                  <p className="text-xs text-emerald-100 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span> Responde al instante
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-emerald-100 hover:text-white hover:bg-emerald-700 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Historial de mensajes */}
            <div className="flex-1 p-4 overflow-y-auto bg-stone-50 flex flex-col gap-4">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-stone-800 text-white rounded-tr-none' : 'bg-white border border-stone-200 text-stone-700 rounded-tl-none shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="p-3 bg-white border border-stone-200 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input y Sugerencias */}
            <div className="bg-white border-t border-stone-100 flex flex-col">
              {/* Sugerencias horizontales scrollables */}
              <div className="flex gap-2 overflow-x-auto p-3 custom-scrollbar border-b border-stone-50">
                {FAQS.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleSendMessage(faq.id)}
                    disabled={isTyping}
                    className="whitespace-nowrap text-xs px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors flex-shrink-0 disabled:opacity-50"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
              
              {/* Formulario de envío */}
              <form onSubmit={onSubmit} className="p-3 flex gap-2 items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[1-7]?$/.test(val)) {
                      setInputValue(val);
                    }
                  }}
                  placeholder="Escribe un número del 1 al 7..."
                  disabled={isTyping}
                  className="flex-1 bg-stone-100 border border-stone-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
