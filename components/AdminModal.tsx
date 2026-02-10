
import React, { useState } from 'react';
import { AdminSettings, Service, BookingData } from '../types';
import { Icons, getIconById } from '../constants';
import { supabase } from '../supabaseClient';

interface AdminModalProps {
  settings: AdminSettings;
  isMinimized: boolean;
  bookings: BookingData[];
  quotes: any[];
  onUpdate: (s: AdminSettings) => void;
  onClose: () => void;
  onMinimize: () => void;
  onLogout: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ settings, isMinimized, bookings, quotes, onUpdate, onClose, onMinimize, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'services' | 'nylah' | 'bookings' | 'quotes'>('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [localSettings, setLocalSettings] = useState<AdminSettings>(settings);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // 1. Guardar Ajustes Generales y de Nylah
      const { error: settingsError } = await supabase.from('admin_settings').upsert({
        id: 1,
        logo_url: localSettings.logoUrl,
        whatsapp_number: localSettings.whatsappNumber,
        flow_link: localSettings.flowLink,
        nylah_avatar_url: localSettings.nylahAvatarUrl,
        nylah_instructions: localSettings.nylahInstructions
      });

      if (settingsError) throw settingsError;

      // 2. Guardar Servicios
      // Borramos los actuales y reinsertamos (estrategia simple para mantener orden)
      await supabase.from('services').delete().neq('id', '0');
      const { error: servicesError } = await supabase.from('services').insert(localSettings.services);
      
      if (servicesError) throw servicesError;

      onUpdate(localSettings);
      setSaveStatus('saved');
    } catch (e) {
      console.error(e);
      setSaveStatus('idle');
      alert("Error al guardar en el núcleo.");
    } finally {
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updateService = (id: string, field: keyof Service, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const updateFeature = (serviceId: string, featureIndex: number, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      services: prev.services.map(s => {
        if (s.id !== serviceId) return s;
        const newFeatures = [...s.features];
        newFeatures[featureIndex] = value;
        return { ...s, features: newFeatures };
      })
    }));
  };

  const addFeature = (serviceId: string) => {
    setLocalSettings(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === serviceId ? { ...s, features: [...s.features, "Nueva característica"] } : s)
    }));
  };

  const removeFeature = (serviceId: string, featureIndex: number) => {
    setLocalSettings(prev => ({
      ...prev,
      services: prev.services.map(s => {
        if (s.id !== serviceId) return s;
        return { ...s, features: s.features.filter((_, i) => i !== featureIndex) };
      })
    }));
  };

  const addService = () => {
    const newId = `service-${Date.now()}`;
    const newService: Service = {
      id: newId,
      title: 'Nuevo Módulo',
      description: 'Descripción breve...',
      price: '$0 CLP',
      features: ['Característica 1'],
      icon: 'web'
    };
    setLocalSettings(prev => ({ ...prev, services: [...prev.services, newService] }));
  };

  const removeService = (id: string) => {
    setLocalSettings(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
  };

  if (isMinimized) return (
    <div className="fixed bottom-6 left-6 z-[200]">
      <button onClick={onMinimize} className="bg-slate-900 text-[#c5a059] border-2 border-[#c5a059] px-8 py-4 rounded-full font-hud text-[10px] animate-pulse shadow-2xl">RESTABLECER_PANEL</button>
    </div>
  );

  return (
    <div className="fixed z-[150] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[90%] max-w-7xl">
      <div className="glass h-full rounded-2xl border-t-8 border-t-[#c5a059] shadow-3xl flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white font-hud">
          <div className="flex items-center gap-4">
            <h3 className="tracking-widest uppercase font-black text-sm">NÚCLEO_ADMIN_VNET_5.0</h3>
            <div className="px-3 py-1 bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[8px] rounded-full">SISTEMA_OPERATIVO_ACTIVO</div>
          </div>
          <div className="flex gap-6 items-center">
             <div className="flex items-center gap-2">
               <div className={`w-2.5 h-2.5 rounded-full ${saveStatus === 'saved' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' : 'bg-slate-600'}`} />
               <span className="text-[9px] opacity-70 uppercase tracking-widest">{saveStatus}</span>
             </div>
             <button onClick={onMinimize} className="text-slate-400 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></button>
             <button onClick={onLogout} className="text-red-500 text-[10px] font-black border border-red-500/30 px-5 py-2 hover:bg-red-500 hover:text-white transition-all">CERRAR_SESIÓN</button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
             <div className="p-6 space-y-2 flex-grow overflow-y-auto custom-scrollbar">
               {[
                 { id: 'general', label: 'CONFIG_GENERAL', icon: '⚙️' },
                 { id: 'services', label: 'MÓDULOS_SERVICIOS', icon: '🛠️' },
                 { id: 'nylah', label: 'IA_NYLAH_CORE', icon: '🧠' },
                 { id: 'bookings', label: 'RESERVAS_USER', icon: '📅' },
                 { id: 'quotes', label: 'COTIZACIONES_LEADS', icon: '📄' }
               ].map((t: any) => (
                 <button 
                  key={t.id} 
                  onClick={() => setActiveTab(t.id)} 
                  className={`w-full p-5 text-left font-hud text-[10px] uppercase tracking-widest flex items-center gap-4 transition-all ${activeTab === t.id ? 'bg-white border-l-8 border-[#c5a059] text-slate-900 shadow-sm font-black' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                 >
                   <span>{t.icon}</span>
                   {t.label}
                 </button>
               ))}
             </div>
             <div className="p-6 border-t border-slate-200">
               <button onClick={handleSave} className="w-full py-6 bg-[#c5a059] text-white font-hud text-[11px] font-black uppercase tracking-[0.3em] shadow-lg hover:shadow-[#c5a059]/40 active:scale-95 transition-all">GUARDAR_EN_NÚCLEO</button>
             </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-slate-50/30">
             {activeTab === 'general' && (
               <div className="max-w-3xl space-y-10">
                 <h2 className="font-hud text-lg font-black text-slate-800 border-b pb-4">Ajustes de Infraestructura</h2>
                 <div className="grid grid-cols-1 gap-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-hud font-black text-slate-400 tracking-widest uppercase">Enlace_Logo_Personalizado (URL)</label>
                     <input type="text" value={localSettings.logoUrl} onChange={e => setLocalSettings({...localSettings, logoUrl: e.target.value})} className="w-full p-5 bg-white border border-slate-200 outline-none font-hud text-xs focus:border-[#c5a059] shadow-sm" placeholder="https://..." />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-hud font-black text-slate-400 tracking-widest uppercase">Canal_WhatsApp (Número con código)</label>
                     <input type="text" value={localSettings.whatsappNumber} onChange={e => setLocalSettings({...localSettings, whatsappNumber: e.target.value})} className="w-full p-5 bg-white border border-slate-200 outline-none font-hud text-xs focus:border-[#c5a059] shadow-sm" placeholder="569..." />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-hud font-black text-slate-400 tracking-widest uppercase">Pasarela_Pago_Flow (Link)</label>
                     <input type="text" value={localSettings.flowLink} onChange={e => setLocalSettings({...localSettings, flowLink: e.target.value})} className="w-full p-5 bg-white border border-slate-200 outline-none font-hud text-xs focus:border-[#c5a059] shadow-sm" placeholder="https://www.flow.cl/..." />
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'services' && (
               <div className="space-y-10">
                 <div className="flex justify-between items-center border-b pb-6">
                   <h2 className="font-hud text-lg font-black text-slate-800 uppercase tracking-tighter">Gestión de Módulos</h2>
                   <button onClick={addService} className="px-6 py-3 bg-slate-900 text-white font-hud text-[10px] font-black tracking-widest hover:bg-[#c5a059] transition-all">+ AÑADIR_MÓDULO</button>
                 </div>
                 
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                   {localSettings.services.map((s, idx) => (
                     <div key={s.id} className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm relative group hover:border-[#c5a059] transition-all">
                       <button onClick={() => removeService(s.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                       
                       <div className="grid grid-cols-2 gap-6">
                         <div className="col-span-2 space-y-2">
                           <label className="text-[9px] font-hud text-slate-400 uppercase font-black">Título del Módulo</label>
                           <input value={s.title} onChange={e => updateService(s.id, 'title', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 font-hud text-xs font-black uppercase" />
                         </div>
                         <div className="col-span-2 space-y-2">
                           <label className="text-[9px] font-hud text-slate-400 uppercase font-black">Descripción</label>
                           <textarea value={s.description} onChange={e => updateService(s.id, 'description', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 font-bold text-xs h-20 resize-none" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] font-hud text-slate-400 uppercase font-black">Precio / Inversión</label>
                           <input value={s.price} onChange={e => updateService(s.id, 'price', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 font-hud text-xs text-[#c5a059] font-black" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] font-hud text-slate-400 uppercase font-black">Icono Base</label>
                           <select value={s.icon} onChange={e => updateService(s.id, 'icon', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 font-hud text-[10px] font-black appearance-none cursor-pointer">
                             <option value="web">WEB PROTOCOL</option>
                             <option value="mobile">MOBILE UI</option>
                             <option value="software">CORE SOFTWARE</option>
                           </select>
                         </div>
                         <div className="col-span-2 space-y-4">
                           <div className="flex justify-between items-center">
                             <label className="text-[9px] font-hud text-slate-400 uppercase font-black">Características (Features)</label>
                             <button onClick={() => addFeature(s.id)} className="text-[#c5a059] text-[9px] font-black hover:underline">+ AÑADIR_PUNTO</button>
                           </div>
                           <div className="space-y-2">
                             {s.features.map((feat, fIdx) => (
                               <div key={fIdx} className="flex gap-2">
                                 <input value={feat} onChange={e => updateFeature(s.id, fIdx, e.target.value)} className="flex-1 p-3 bg-slate-50 border border-slate-100 text-[10px] font-bold" />
                                 <button onClick={() => removeFeature(s.id, fIdx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                               </div>
                             ))}
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {activeTab === 'nylah' && (
               <div className="max-w-3xl space-y-10">
                 <h2 className="font-hud text-lg font-black text-slate-800 border-b pb-4 uppercase">Configuración Nylah Core</h2>
                 <div className="space-y-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-hud font-black text-slate-400 tracking-widest uppercase">Imagen_Avatar (URL)</label>
                     <input type="text" value={localSettings.nylahAvatarUrl} onChange={e => setLocalSettings({...localSettings, nylahAvatarUrl: e.target.value})} className="w-full p-5 bg-white border border-slate-200 outline-none font-hud text-xs" />
                     {localSettings.nylahAvatarUrl && <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#c5a059]/20 shadow-xl"><img src={localSettings.nylahAvatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" /></div>}
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-hud font-black text-slate-400 tracking-widest uppercase">Directrices_Comportamiento (Prompt)</label>
                     <textarea value={localSettings.nylahInstructions} onChange={e => setLocalSettings({...localSettings, nylahInstructions: e.target.value})} className="w-full h-80 p-6 bg-white border border-slate-200 outline-none font-bold text-xs leading-relaxed resize-none shadow-sm" placeholder="Escribe aquí las instrucciones de personalidad..." />
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'bookings' && (
               <div className="space-y-10">
                 <h2 className="font-hud text-lg font-black text-slate-800 border-b pb-4 uppercase">Registro de Sesiones</h2>
                 <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-slate-900 text-white font-hud text-[9px] uppercase tracking-widest">
                         <th className="p-6">Sujeto</th>
                         <th className="p-6">Fecha // Hora</th>
                         <th className="p-6">Comunicación</th>
                         <th className="p-6">Status</th>
                       </tr>
                     </thead>
                     <tbody className="text-xs font-bold divide-y divide-slate-100">
                       {bookings.length === 0 ? (
                         <tr><td colSpan={4} className="p-12 text-center text-slate-300 font-hud uppercase tracking-widest">No hay registros de transmisiones...</td></tr>
                       ) : (
                         bookings.map((b, i) => (
                           <tr key={i} className="hover:bg-slate-50 transition-colors">
                             <td className="p-6 uppercase">{b.name}</td>
                             <td className="p-6 font-hud text-[10px] text-[#c5a059]">{b.date} • {b.time}</td>
                             <td className="p-6 opacity-60">{b.phone || 'No especificado'}</td>
                             <td className="p-6"><span className="px-3 py-1 bg-green-500/10 text-green-600 text-[8px] font-black rounded-full border border-green-500/20">PENDIENTE_VISITA</span></td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}

             {activeTab === 'quotes' && (
               <div className="space-y-10">
                 <h2 className="font-hud text-lg font-black text-slate-800 border-b pb-4 uppercase">Cotizaciones Recibidas</h2>
                 <div className="grid grid-cols-1 gap-6">
                   {quotes.length === 0 ? (
                     <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-sm text-slate-300 font-hud uppercase tracking-widest">Sin solicitudes entrantes...</div>
                   ) : (
                     quotes.map((q, i) => (
                       <div key={i} className="bg-white border p-8 rounded-sm shadow-sm hover:border-[#c5a059] transition-all relative">
                         <div className="flex justify-between items-start mb-6">
                           <div>
                             <h4 className="font-hud text-sm font-black text-slate-800 uppercase tracking-tighter">{q.name}</h4>
                             <p className="text-[10px] text-[#c5a059] font-hud font-black uppercase mt-1">Lead_ID: {q.id.split('-')[0]}</p>
                           </div>
                           <div className="text-right">
                             <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[8px] font-black rounded-full uppercase tracking-widest">{q.service_type || q.serviceType}</span>
                           </div>
                         </div>
                         <div className="grid grid-cols-2 gap-8 mb-6">
                           <div className="space-y-1">
                             <label className="text-[8px] font-hud text-slate-400 font-black uppercase tracking-widest">Enlace_Email</label>
                             <p className="text-[11px] font-bold text-slate-700">{q.email}</p>
                           </div>
                           <div className="space-y-1">
                             <label className="text-[8px] font-hud text-slate-400 font-black uppercase tracking-widest">Fecha_Transmisión</label>
                             <p className="text-[11px] font-bold text-slate-700">{new Date(q.created_at).toLocaleString()}</p>
                           </div>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[8px] font-hud text-slate-400 font-black uppercase tracking-widest">Requerimientos_Proyecto</label>
                           <p className="text-[11px] text-slate-600 leading-relaxed italic bg-slate-50 p-4 border border-slate-100 italic">"{q.description}"</p>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
