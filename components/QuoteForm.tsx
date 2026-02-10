
import React from 'react';
import { QuoteFormData } from '../types';

interface QuoteFormProps {
  initialData: QuoteFormData;
  onSubmit: (data: QuoteFormData) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = React.useState<QuoteFormData>(initialData);

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-10 border-r-4 border-r-[#c5a059] space-y-8 relative shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="space-y-3">
          <label className="font-hud text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black">Nombre Completo</label>
          <input 
            type="text" 
            className="w-full bg-white border border-slate-200 p-4 font-hud text-[11px] focus:border-[#c5a059] outline-none text-slate-800 transition-all rounded-sm shadow-inner uppercase tracking-widest"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="EJ: VICTOR N. CHILE"
          />
        </div>
        <div className="space-y-3">
          <label className="font-hud text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black">Módulo de Servicio</label>
          <div className="relative">
            <select 
              className="w-full bg-white border border-slate-200 p-4 font-hud text-[11px] focus:border-[#c5a059] outline-none text-slate-800 appearance-none transition-all rounded-sm cursor-pointer shadow-inner uppercase tracking-widest"
              value={formData.serviceType}
              onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
            >
              <option value="web">WEB PROTOCOL</option>
              <option value="mobile">MOBILE INTERFACE</option>
              <option value="software">CORE SOFTWARE</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#c5a059]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 relative z-10">
        <label className="font-hud text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black">Enlace de Comunicación</label>
        <input 
          type="email" 
          className="w-full bg-white border border-slate-200 p-4 font-hud text-[11px] focus:border-[#c5a059] outline-none text-slate-800 transition-all rounded-sm shadow-inner uppercase tracking-widest"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder="TRANS@CANAL.CL"
        />
      </div>

      <div className="space-y-3 relative z-10">
        <label className="font-hud text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black">Especificaciones del Núcleo</label>
        <textarea 
          rows={6}
          className="w-full bg-white border border-slate-200 p-4 font-hud text-[11px] focus:border-[#c5a059] outline-none text-slate-800 resize-none transition-all rounded-sm shadow-inner uppercase tracking-widest leading-relaxed"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describa el despliegue tecnológico requerido para su infraestructura..."
        />
      </div>

      <button 
        type="submit"
        className="w-full py-6 border-2 border-[#c5a059] text-[#c5a059] font-hud font-black text-xs tracking-[0.5em] hover:bg-[#c5a059] hover:text-white transition-all shadow-xl hover:shadow-[0_15px_40px_rgba(197,160,89,0.25)]"
      >
        EJECUTAR SOLICITUD
      </button>
    </form>
  );
};

export default QuoteForm;
