
import React, { useState } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'Vinet' && pass === '#Kalilinux22') {
      onSuccess();
      const modal = document.getElementById('admin-login-modal');
      if (modal) modal.style.display = 'none';
      setUser('');
      setPass('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div id="admin-login-modal" className="fixed inset-0 z-[100] hidden bg-black/60 backdrop-blur-md">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]">
        <div className="glass p-10 rounded-2xl border-t-4 border-t-[#c5a059] shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="font-hud text-xl font-black text-slate-800 tracking-widest uppercase">ADMIN_LOGIN</h3>
            <p className="font-hud text-[9px] text-[#c5a059] tracking-[0.4em] mt-2">NÚCLEO DE SEGURIDAD VNET</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-hud text-[9px] text-slate-400 uppercase tracking-widest font-black">USUARIO_ID</label>
              <input 
                type="text" 
                value={user}
                onChange={e => setUser(e.target.value)}
                className="w-full bg-white/50 border border-slate-200 p-4 font-hud text-[12px] outline-none focus:border-[#c5a059] rounded-sm transition-all"
                placeholder="Identidad..."
              />
            </div>
            <div className="space-y-2">
              <label className="font-hud text-[9px] text-slate-400 uppercase tracking-widest font-black">PASSWORD_KEY</label>
              <input 
                type="password" 
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full bg-white/50 border border-slate-200 p-4 font-hud text-[12px] outline-none focus:border-[#c5a059] rounded-sm transition-all"
                placeholder="••••••••"
              />
            </div>
            
            {error && <p className="text-red-500 font-hud text-[10px] text-center animate-pulse">CREDENTIALS_REJECTED // ACCESS_DENIED</p>}
            
            <button type="submit" className="w-full py-5 bg-slate-900 text-white font-hud font-black text-xs tracking-[0.5em] hover:bg-[#c5a059] transition-all rounded-sm shadow-xl">
              AUTORIZAR_ACCESO
            </button>
            <button 
              type="button" 
              onClick={() => {
                const modal = document.getElementById('admin-login-modal');
                if (modal) modal.style.display = 'none';
              }}
              className="w-full text-slate-400 font-hud text-[9px] uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              CERRAR_TERMINAL
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
