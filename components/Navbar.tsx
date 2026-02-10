
import React from 'react';
import { AppSection } from '../types';
import { Logo } from '../constants';

interface NavbarProps {
  onNavigate: (section: AppSection) => void;
  activeSection: AppSection;
  logoOverride?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection, logoOverride }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-12 py-8 flex justify-between items-center glass border-b border-slate-200/40 shadow-sm backdrop-blur-3xl">
      <div className="cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => onNavigate(AppSection.HOME)}>
        {logoOverride ? (
          <img src={logoOverride} alt="Custom Logo" className="h-12 object-contain" />
        ) : (
          <Logo className="h-10" />
        )}
      </div>

      <div className="hidden lg:flex gap-16">
        {[
          { id: AppSection.HOME, label: 'INICIO_CORE' },
          { id: AppSection.CATALOG, label: 'MÓDULOS' },
          { id: AppSection.BOOKING, label: 'RESERVAS' },
          { id: AppSection.QUOTE, label: 'COTIZAR' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`font-hud text-[10px] tracking-[0.5em] font-black transition-all relative group uppercase ${
              activeSection === item.id ? 'text-[#c5a059]' : 'text-slate-400 hover:text-slate-800'
            }`}
          >
            {item.label}
            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 h-0.5 bg-[#c5a059] transition-all duration-500 ${activeSection === item.id ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`} />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-10">
        <button 
          onClick={() => onNavigate(AppSection.CONTACT)}
          className="px-12 py-3 bg-slate-900 text-white font-hud text-[10px] font-black tracking-[0.4em] hover:bg-[#c5a059] transition-all shadow-xl uppercase border border-white/10"
        >
          CONECTAR
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
