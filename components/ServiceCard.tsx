
import React from 'react';
import { Service } from '../types';
import { getIconById } from '../constants';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps & { onQuote: () => void }> = ({ service, onQuote }) => {
  return (
    <div className="glass p-10 group transition-all duration-700 relative overflow-hidden flex flex-col h-full border border-slate-100 hover:border-[#c5a059] shadow-xl hover:shadow-[#c5a059]/10 rounded-sm bg-white/60">
      {/* HUD Accents */}
      <div className="absolute top-0 left-0 w-6 h-px bg-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 left-0 w-px h-6 bg-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-6 h-px bg-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-px h-6 bg-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8 text-[#c5a059] bg-slate-50 w-16 h-16 flex items-center justify-center rounded-sm border border-slate-100 transition-all group-hover:bg-[#c5a059] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]">
          {getIconById(service.icon)}
        </div>
        
        <div className="font-hud text-[8px] tracking-[0.4em] text-[#c5a059] mb-4 font-black uppercase opacity-60">Module_Protocol_{service.id.toUpperCase()}</div>
        <h3 className="font-hud text-xl font-black mb-6 tracking-tighter text-slate-800 group-hover:text-[#c5a059] transition-colors uppercase leading-tight">{service.title}</h3>
        <p className="text-slate-500 text-[13px] mb-10 leading-relaxed font-bold uppercase tracking-wider h-12 overflow-hidden">{service.description}</p>
        
        <div className="space-y-4 mb-12 flex-grow">
          {service.features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-snug">
              <span className="text-[#c5a059] font-black opacity-80 mt-0.5">†</span>
              {f}
            </div>
          ))}
        </div>

        <div className="relative z-10 pt-8 border-t border-slate-100 flex justify-between items-end mt-auto">
          <div className="flex-1">
            <p className="text-[9px] font-hud text-slate-400 tracking-[0.4em] uppercase font-black mb-2 opacity-60">Inversión Estimada</p>
            <p className="font-hud text-[#c5a059] font-black text-lg tracking-tighter leading-none">{service.price}</p>
          </div>
          <button 
            onClick={onQuote}
            className="w-14 h-14 flex items-center justify-center border border-slate-100 hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-white transition-all rounded-sm group/btn shadow-md active:scale-95 bg-white"
            title="Solicitar Cotización"
          >
            <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
