
import React, { useState, useEffect, useRef } from 'react';
import { AppSection, Service, QuoteFormData, BookingData, AdminSettings } from './types';
import { Icons, Logo } from './constants';
import Navbar from './components/Navbar';
import ServiceCard from './components/ServiceCard';
import BookingCalendar from './components/BookingCalendar';
import QuoteForm from './components/QuoteForm';
import AIAssistant from './components/AIAssistant';
import HUDOverlay from './components/HUDOverlay';
import AdminModal from './components/AdminModal';
import AdminLogin from './components/AdminLogin';
import { supabase } from './supabaseClient';

const REQUIRED_SERVICES: Service[] = [
  {
    id: 'web',
    title: 'Desarrollo Web Next-Gen',
    description: 'Sitios web autónomos con IA integrada y diseño de vanguardia.',
    price: '$200.000 CLP',
    features: [
      'Diseño gráfico según especificaciones o referencias.',
      'Secciones e interactividades ilimitadas por el mismo valor.',
      'Optimizado para buscadores e Inteligencia Artificial.',
      'Secretaría IA (Nylah) que atiende por voz y manipula el sitio.',
      'Soporte técnico permanente.',
      'Pagas solo después de estar instalado y funcional.'
    ],
    icon: 'web'
  },
  {
    id: 'mobile',
    title: 'Aplicaciones Móviles (Android & iOS)',
    description: 'Apps personalizadas enfocadas en UX y alto rendimiento.',
    price: 'Evaluación personalizada',
    features: [
      'Nativas o multiplataforma.',
      'Diseño intuitivo y fácil de usar.',
      'Integración total con APIs y bases de datos.',
      'Escalabilidad garantizada.',
      'Presupuesto justo según complejidad.'
    ],
    icon: 'mobile'
  },
  {
    id: 'software',
    title: 'Software de Gestión a Medida',
    description: 'Sistemas diseñados para optimizar y automatizar tus procesos.',
    price: 'Evaluación personalizada',
    features: [
      'Adaptado a cualquier flujo de trabajo.',
      'Gestión de roles y permisos avanzados.',
      'Reportes y estadísticas en tiempo real.',
      'Automatización de tareas internas.',
      'Altos estándares de seguridad.'
    ],
    icon: 'software'
  }
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [quoteData, setQuoteData] = useState<QuoteFormData>({ name: '', email: '', serviceType: 'web', description: '' });
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isAiActive, setIsAiActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    logoUrl: '',
    whatsappNumber: '56986017554',
    flowLink: 'https://www.flow.cl',
    nylahAvatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800&h=1200",
    nylahInstructions: "Tu nombre es Nylah. Eres la secretaria de Virtual Network Chile.",
    services: REQUIRED_SERVICES
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 15);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const { data: settingsData } = await supabase.from('admin_settings').select('*').eq('id', 1).maybeSingle();
      const { data: servicesData } = await supabase.from('services').select('*');
      const { data: bookingsData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      const { data: quotesData } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });

      if (settingsData) {
        setAdminSettings(prev => ({
          ...prev,
          logoUrl: settingsData.logo_url || prev.logoUrl,
          whatsappNumber: settingsData.whatsapp_number || prev.whatsappNumber,
          flowLink: settingsData.flow_link || prev.flowLink,
          nylahAvatarUrl: settingsData.nylah_avatar_url || prev.nylahAvatarUrl,
          nylahInstructions: settingsData.nylah_instructions || prev.nylahInstructions,
        }));
      }

      if (servicesData && servicesData.length > 0) {
        setAdminSettings(prev => ({ ...prev, services: servicesData }));
      } else {
        // Si no hay nada, cargamos los por defecto para que el sitio no se vea vacío
        setAdminSettings(prev => ({ ...prev, services: REQUIRED_SERVICES }));
      }

      if (bookingsData) setBookings(bookingsData);
      if (quotesData) setQuotes(quotesData);
      
    } catch (error) {
      console.warn("Fallo de sincronización inicial.", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [secretClicks, setSecretClicks] = useState<number[]>([]);
  const [isAwaitingCombo, setIsAwaitingCombo] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdminMinimized, setIsAdminMinimized] = useState(false);

  const homeRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) setIsAiActive(true);
    }, 3000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAwaitingCombo && e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') {
        setIsAwaitingCombo(false);
        const modal = document.getElementById('admin-login-modal');
        if (modal) modal.style.display = 'block';
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id as AppSection);
        }
      });
    }, { threshold: 0.3 });

    [homeRef.current, catalogRef.current, bookingRef.current, quoteRef.current].forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [isAwaitingCombo, isLoading]);

  const handleSecretClick = () => {
    const now = Date.now();
    const newClicks = [...secretClicks, now].filter(t => now - t < 5000);
    setSecretClicks(newClicks);
    if (newClicks.length >= 5) {
      setIsAwaitingCombo(true);
      setSecretClicks([]);
      const sensor = document.getElementById('secret-lock-icon');
      if (sensor) {
        sensor.classList.add('animate-ping');
        sensor.classList.add('text-[#c5a059]');
        setTimeout(() => sensor.classList.remove('animate-ping'), 1000);
      }
    }
  };

  const handleNavigation = (section: AppSection) => {
    const refMap: any = { [AppSection.HOME]: homeRef, [AppSection.CATALOG]: catalogRef, [AppSection.BOOKING]: bookingRef, [AppSection.QUOTE]: quoteRef };
    const target = refMap[section];
    if (target?.current) {
      window.scrollTo({ top: target.current.offsetTop - 100, behavior: 'smooth' });
    }
  };

  const handleBook = async (data: BookingData) => {
    const { error } = await supabase.from('bookings').insert([data]);
    if (!error) {
      alert("Reserva confirmada. El equipo VNET se pondrá en contacto.");
      fetchData();
    } else alert("Error en la transmisión de reserva.");
  };

  const handleQuote = async (data: QuoteFormData) => {
    const { error } = await supabase.from('quotes').insert([data]);
    if (!error) {
      alert("Solicitud de cotización enviada con éxito.");
      fetchData();
    } else alert("Error al enviar cotización.");
  };

  const handleFillQuote = (data: Partial<QuoteFormData>) => {
    setQuoteData(prev => ({ ...prev, ...data }));
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center font-hud text-white">
        <div className="relative mb-12">
          <div className="w-40 h-40 border border-[#c5a059]/10 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-40 h-40 border-t-2 border-[#c5a059] animate-spin rounded-full shadow-[0_0_30px_rgba(197,160,89,0.5)]" />
          <div className="absolute inset-0 flex items-center justify-center text-[#c5a059] text-sm font-black tracking-widest">
            {loadProgress}%
          </div>
        </div>
        <div className="space-y-4 text-center">
          <p className="text-[#c5a059] tracking-[1em] text-[10px] uppercase font-black animate-pulse">Sincronizando_Núcleo_VNET</p>
          <div className="flex gap-1 justify-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-6 h-1 bg-[#c5a059]/20 overflow-hidden rounded-full">
                <div className="h-full bg-[#c5a059] animate-[loading_2s_infinite]" style={{ animationDelay: `${i * 0.1}s` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative fui-grid fui-grid-fine selection:bg-[#c5a059]/30 bg-white">
      <HUDOverlay />
      <Navbar onNavigate={handleNavigation} activeSection={activeSection} logoOverride={adminSettings.logoUrl} />

      <section ref={homeRef} id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white opacity-80" />
        <div className="relative z-10 px-6 text-center max-w-5xl">
          <div className="font-hud text-[10px] tracking-[0.8em] text-[#c5a059] mb-8 font-black uppercase glow-text">Next_Gen_Engineering</div>
          <h1 className="font-hud text-5xl md:text-8xl font-black mb-10 text-slate-900 leading-tight uppercase tracking-tighter">Desarrollo <br/><span className="text-[#c5a059] glow-text">NextGen</span></h1>
          <p className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto uppercase tracking-widest font-bold">Interfaces inteligentes con IA autónoma y diseño HUD/FUI.</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button onClick={() => handleNavigation(AppSection.CATALOG)} className="group relative px-12 py-6 bg-slate-900 text-white font-hud font-black text-xs tracking-[0.5em] overflow-hidden transition-all shadow-2xl active:scale-95 w-full md:w-auto">
              <span className="relative z-10">VER CATÁLOGO</span>
              <div className="absolute inset-0 bg-[#c5a059] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button onClick={() => handleNavigation(AppSection.QUOTE)} className="px-12 py-6 border-2 border-slate-900 text-slate-900 font-hud font-black text-xs tracking-[0.5em] hover:bg-slate-900 hover:text-white transition-all w-full md:w-auto">
              SOLICITAR_COTIZACIÓN
            </button>
          </div>
        </div>
      </section>

      <section ref={catalogRef} id="catalog" className="py-40 px-6 max-w-7xl mx-auto relative z-20">
        <h2 className="font-hud text-4xl font-black text-slate-800 uppercase tracking-tighter text-center mb-24 glow-text underline decoration-[#c5a059] decoration-4 underline-offset-8">Módulos de Servicio</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {adminSettings.services.length > 0 ? (
            adminSettings.services.map((s) => (
              <ServiceCard key={s.id} service={s} onQuote={() => handleNavigation(AppSection.QUOTE)} />
            ))
          ) : (
            <div className="col-span-3 py-32 text-center border-4 border-dashed border-slate-100 rounded-3xl">
               <p className="font-hud text-slate-300 text-xs tracking-[0.5em] uppercase">Scan_Result: No_Data_Found</p>
            </div>
          )}
        </div>
      </section>

      <div className="bg-slate-50/50 py-40 border-y border-slate-100 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
          <section ref={bookingRef} id="booking">
            <h2 className="font-hud text-3xl font-black text-slate-800 mb-12 uppercase">Gestión de Reservas</h2>
            <BookingCalendar bookings={bookings} onBook={handleBook} />
          </section>
          <section ref={quoteRef} id="quote">
            <h2 className="font-hud text-3xl font-black text-slate-800 mb-12 uppercase text-right">Cotización de Proyecto</h2>
            <QuoteForm initialData={quoteData} onSubmit={handleQuote} />
          </section>
        </div>
      </div>

      <AdminLogin onSuccess={() => { setIsAdminLoggedIn(true); setShowAdminPanel(true); setIsAiActive(false); }} />
      {isAdminLoggedIn && showAdminPanel && (
        <AdminModal 
          settings={adminSettings} 
          isMinimized={isAdminMinimized} 
          bookings={bookings}
          quotes={quotes}
          onUpdate={(s) => { setAdminSettings(s); fetchData(); }} 
          onClose={() => setShowAdminPanel(false)} 
          onMinimize={() => setIsAdminMinimized(!isAdminMinimized)} 
          onLogout={() => { setIsAdminLoggedIn(false); setShowAdminPanel(false); setIsAiActive(true); }} 
        />
      )}

      <footer className="py-20 border-t border-slate-100 bg-white flex flex-col items-center">
        <Logo className="mb-8" />
        <div className="flex gap-8 mb-8">
           <a href={`https://wa.me/${adminSettings.whatsappNumber}`} target="_blank" className="font-hud text-[10px] text-slate-600 hover:text-[#c5a059] tracking-widest font-black transition-colors uppercase">WHATSAPP_LINK</a>
           <a href={adminSettings.flowLink} target="_blank" className="font-hud text-[10px] text-slate-600 hover:text-[#c5a059] tracking-widest font-black transition-colors uppercase">PAGOS_FLOW</a>
        </div>
        <p className="font-hud text-[9px] text-slate-400 tracking-[0.4em] uppercase font-bold">© 2024 VNET CHILE • Próxima Generación de Desarrollo Web</p>
        <div className="fixed bottom-6 left-6 z-[60]">
           <div id="secret-lock-icon" title="Terminal de Administración" onClick={handleSecretClick} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-200 hover:text-[#c5a059] cursor-pointer transition-all rounded-full shadow-sm"><Icons.Lock /></div>
        </div>
      </footer>

      {isAiActive && !showAdminPanel && (
        <AIAssistant isActive={isAiActive} activeSection={activeSection} customAvatar={adminSettings.nylahAvatarUrl} customInstructions={adminSettings.nylahInstructions} onClose={() => setIsAiActive(false)} onNavigation={handleNavigation} onFillQuote={handleFillQuote} onBook={handleBook} />
      )}
    </div>
  );
};

export default App;
