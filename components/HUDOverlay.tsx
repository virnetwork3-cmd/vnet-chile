
import React from 'react';

const HUDOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden opacity-40">
      {/* Corner Brackets - More technical */}
      <div className="absolute top-10 left-10 w-48 h-48 border-t-2 border-l-2 border-[#c5a059]/30" />
      <div className="absolute top-10 right-10 w-48 h-48 border-t-2 border-r-2 border-[#c5a059]/30" />
      <div className="absolute bottom-10 left-10 w-48 h-48 border-b-2 border-l-2 border-[#c5a059]/30" />
      <div className="absolute bottom-10 right-10 w-48 h-48 border-b-2 border-r-2 border-[#c5a059]/30" />

      {/* Floating technical indicators with Code Feed */}
      <div className="absolute top-1/4 left-12 hidden xl:block font-hud text-[9px] text-[#c5a059] space-y-6 font-black tracking-[0.4em]">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-[#c5a059] shadow-[0_0_10px_#c5a059]" />
          <p>LOC_SANTIAGO_CL</p>
        </div>
        <div className="bg-black/5 p-4 border-l-2 border-[#c5a059]/40 backdrop-blur-md">
          <p className="opacity-70 text-[7px] leading-relaxed animate-pulse">
            > EXECUTING_RECURSION...<br/>
            > NYLAH_CORE_SYNC: OK<br/>
            > ASSET_LOAD: 100%
          </p>
        </div>
        <p className="opacity-50 text-[8px]">33.4489° S // 70.6693° W</p>
        <div className="h-1 w-40 bg-slate-200 overflow-hidden">
            <div className="h-full bg-[#c5a059] animate-[loading_6s_ease-in-out_infinite]" />
        </div>
        <p className="text-[8px] tracking-[0.6em]">NEURAL_CORE: ACTIVE</p>
      </div>

      <div className="absolute bottom-1/4 right-12 hidden xl:block font-hud text-[9px] text-[#c5a059] space-y-6 text-right font-black tracking-[0.4em]">
        <p>SYSTEM_SYNC: 99.998%</p>
        <div className="flex justify-end gap-1.5">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`w-2 h-6 ${i < 13 ? 'bg-[#c5a059]/40' : 'bg-slate-200/20'} transition-all`} />
          ))}
        </div>
        <div className="bg-black/5 p-4 border-r-2 border-[#c5a059]/40 backdrop-blur-md text-left">
          <p className="opacity-70 text-[7px] leading-tight font-mono overflow-hidden h-12">
            0x45 0x11 0xAA 0x01<br/>
            0xFF 0x00 0xBC 0x42<br/>
            0xDE 0xAD 0xBE 0xEF
          </p>
        </div>
        <p className="opacity-50 uppercase text-[8px]">Buffer_Rate: 0.00012ms</p>
        <p className="text-[#c5a059] animate-pulse shadow-sm">UPDATING_MODELS...</p>
      </div>

      {/* Central Oblivion-style HUD Rings with spinning code bits */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[700px] h-[700px] oblivion-ring animate-spin-slow opacity-15" />
        <div className="w-[900px] h-[900px] oblivion-ring animate-spin-reverse opacity-10" />
        <div className="w-[1200px] h-[1200px] oblivion-ring opacity-5" />
        
        {/* Abstract Spinning Text (Code snippets) */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow opacity-10">
          <div className="font-hud text-[12px] text-[#c5a059] whitespace-nowrap tracking-[3em] uppercase">
             Autonomous_Intelligence_Development_Virtual_Network_Chile
          </div>
        </div>
      </div>

      {/* Crosshairs - Refined */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/30 to-transparent" />
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-[#c5a059]/30 to-transparent" />

      {/* Small Data Particles */}
      {[...Array(25)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1.5 h-1.5 bg-[#c5a059]/30 rounded-full animate-float shadow-[0_0_5px_#c5a059]"
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 12}s`,
            animationDuration: `${20 + Math.random() * 30}s`
          }}
        />
      ))}
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() * 80}px, ${Math.random() * 80}px); }
        }
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 150s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 200s linear infinite; }
        .animate-float { animation: float linear infinite; }
      `}</style>
    </div>
  );
};

export default HUDOverlay;
