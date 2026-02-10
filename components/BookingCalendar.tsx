
import React, { useState } from 'react';
import { BookingData } from '../types';

interface BookingCalendarProps {
  bookings: BookingData[];
  onBook: (data: BookingData) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings, onBook }) => {
  const [formData, setFormData] = useState({ date: '', time: '', name: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.name) return;
    onBook(formData);
    setFormData({ date: '', time: '', name: '', phone: '' });
  };

  return (
    <div className="glass p-10 border-l-4 border-l-[#c5a059] relative shadow-lg">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="space-y-3">
          <label className="font-hud text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black">Calendario Estelar</label>
          <input 
            type="date" 
            className="w-full bg-white border border-slate-200 p-4 font-hud text-[11px] focus:border-[#c5a059] outline-none text-slate-800 transition-all rounded-sm shadow-inner"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-3">
          <label className="font-hud text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black">Frecuencia Horaria</label>
          <input 
            type="time" 
            className="w-full bg-white border border-slate-200 p-4 font-hud text-[11px] focus:border-[#c5a059] outline-none text-slate-800 transition-all rounded-sm shadow-inner"
            value={formData.time}
            onChange={e => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
        <div className="md:col-span-2 space-y-3">
          <label className="font-hud text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black">Identidad del Sujeto</label>
          <input 
            type="text" 
            placeholder="EJ. COMANDANTE JACK"
            className="w-full bg-white border border-slate-200 p-4 font-hud text-[11px] focus:border-[#c5a059] outline-none text-slate-800 transition-all rounded-sm shadow-inner uppercase tracking-widest"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <button 
          type="submit"
          className="md:col-span-2 py-5 bg-slate-900 text-white font-hud font-black text-xs tracking-[0.4em] hover:bg-[#c5a059] transition-all shadow-xl hover:shadow-[0_10px_30px_rgba(197,160,89,0.3)]"
        >
          SINCRONIZAR RESERVA
        </button>
      </form>

      <div className="mt-12 border-t border-slate-100 pt-8">
        <h4 className="font-hud text-[9px] text-slate-400 mb-6 uppercase tracking-[0.3em] font-black">Sesiones en Curso</h4>
        <div className="space-y-3 max-h-56 overflow-y-auto pr-3 custom-scrollbar">
          {bookings.length === 0 ? (
            <div className="p-6 border-2 border-dashed border-slate-100 rounded-sm text-center">
              <p className="text-slate-300 text-[10px] font-hud uppercase tracking-widest">Esperando Transmisión...</p>
            </div>
          ) : (
            bookings.map((b, i) => (
              <div key={i} className="p-5 bg-white border border-slate-200 flex justify-between items-center group hover:border-[#c5a059] transition-all shadow-sm">
                <div>
                  <p className="font-hud text-[9px] text-[#c5a059] mb-1 font-black">{b.date} // {b.time}</p>
                  <p className="text-xs uppercase font-black text-slate-800 tracking-[0.1em]">{b.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-[#c5a059] font-hud font-black px-3 py-1 border border-[#c5a059]/20 bg-[#c5a059]/5">VERIFICADO</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
