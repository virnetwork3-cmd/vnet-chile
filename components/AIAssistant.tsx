
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { 
  navigateToFunction, 
  fillQuoteFormFunction, 
  bookSessionFunction, 
  decode, 
  decodeAudioData, 
  createPcmBlob 
} from '../geminiService';
import { AppSection, QuoteFormData, BookingData } from '../types';

interface AIAssistantProps {
  isActive: boolean;
  activeSection: AppSection;
  customAvatar?: string;
  customInstructions?: string;
  onClose: () => void;
  onNavigation: (section: AppSection) => void;
  onFillQuote: (data: Partial<QuoteFormData>) => void;
  onBook: (data: BookingData) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isActive, 
  activeSection,
  customAvatar,
  customInstructions,
  onClose, 
  onNavigation, 
  onFillQuote, 
  onBook 
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<string>('NYLAH_STANDBY');
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastInputText, setLastInputText] = useState<string>('');
  const [hasStarted, setHasStarted] = useState(false);

  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const isOnLeft = activeSection === AppSection.QUOTE;
  const avatarUrl = customAvatar || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800&h=1200";

  const initializeNylah = async () => {
    try {
      setStatus('SINCRONIZANDO...');
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      outputNodeRef.current = audioContextRef.current.createGain();
      outputNodeRef.current.connect(audioContextRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: customInstructions || `Tu nombre es Nylah (Nailah). Eres secretaria de Virtual Network Chile. Responde de forma profesional, futurista y servicial.`,
          tools: [{ functionDeclarations: [navigateToFunction, fillQuoteFormFunction, bookSessionFunction] }],
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus('CONECTADA');
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);

            sessionPromise.then(s => s.sendRealtimeInput({ 
              text: "Saluda como Nylah y ofrece ayuda con el catálogo de Virtual Network." 
            }));
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setLastInputText(message.serverContent.inputTranscription.text);
            }

            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                let result = "Ejecutado.";
                if (fc.name === 'navigateTo') onNavigation(fc.args.section as AppSection);
                else if (fc.name === 'fillQuoteForm') { 
                  onFillQuote(fc.args); 
                  onNavigation(AppSection.QUOTE); 
                }
                else if (fc.name === 'bookSession') { 
                  onBook(fc.args as any); 
                  onNavigation(AppSection.BOOKING); 
                }

                sessionPromise.then(s => s.sendToolResponse({
                  functionResponses: { id: fc.id, name: fc.name, response: { result } }
                }));
              }
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current && outputNodeRef.current) {
              setIsSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
              const buffer = await decodeAudioData(decode(audioData), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNodeRef.current);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch(e) {}
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e) => {
            console.error(e);
            setStatus('REINTENTANDO...');
          },
          onclose: () => setStatus('OFFLINE')
        }
      });

      sessionRef.current = await sessionPromise;
      setHasStarted(true);
    } catch (err) { 
      setStatus('SIN_API_KEY');
    }
  };

  useEffect(() => {
    if (!isActive) {
      if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
      }
      return;
    }
    // No auto-start to avoid audio context issues, user must click "VÍNCULO"
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className={`fixed bottom-6 z-[80] transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1) transform ${isMinimized ? 'translate-y-[85%]' : 'translate-y-0'} ${isOnLeft ? 'left-6' : 'right-6'} w-[90%] md:w-auto`}>
      <div className={`glass w-full md:w-[640px] rounded-3xl overflow-hidden border-t-8 border-t-[#c5a059] shadow-[0_70px_180px_rgba(0,0,0,0.4)] flex flex-col ${isOnLeft ? 'md:flex-row-reverse' : 'md:flex-row'} h-auto md:min-h-[420px] transition-all duration-1000`}>
        <div className="w-full md:w-[38%] h-64 md:h-full relative overflow-hidden bg-slate-200">
          <img src={avatarUrl} alt="Nylah" className="w-full h-full object-cover object-top brightness-110 contrast-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
          <div className={`absolute bottom-8 ${isOnLeft ? 'right-8 text-right' : 'left-8'}`}>
            <h3 className="font-hud text-white text-3xl font-black tracking-widest drop-shadow-2xl">NYLAH</h3>
            <p className="font-hud text-[10px] text-[#c5a059] font-black tracking-[0.5em] uppercase">Core IA Sincronizado</p>
          </div>
          <div className={`absolute top-8 ${isOnLeft ? 'right-8' : 'left-8'} flex items-center gap-3 px-5 py-2.5 bg-black/70 backdrop-blur-3xl rounded-full border border-white/20`}>
            <div className={`w-3.5 h-3.5 rounded-full ${isSpeaking ? 'bg-[#c5a059] animate-pulse shadow-[0_0_20px_#c5a059]' : status === 'CONECTADA' ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-[11px] font-hud text-white font-black tracking-[0.2em] uppercase">{status}</span>
          </div>
        </div>
        <div className="flex-1 p-10 flex flex-col justify-between bg-white/95 relative backdrop-blur-3xl min-h-[300px]">
          <button onClick={() => setIsMinimized(!isMinimized)} className={`absolute top-8 ${isOnLeft ? 'left-10' : 'right-10'} p-2 text-slate-400 hover:text-[#c5a059] transition-all transform hover:scale-125 z-10`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} /></svg>
          </button>
          {!hasStarted ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
               <div className="relative">
                 <div className="w-24 h-24 rounded-full border-4 border-[#c5a059]/10 border-t-[#c5a059] animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#c5a059]/20 rounded-full animate-pulse" />
                 </div>
               </div>
               <div className="space-y-4">
                 <p className="text-[10px] font-hud text-slate-400 tracking-[0.3em] font-black uppercase">Protocolo de Asistencia IA</p>
                 <button onClick={initializeNylah} className="px-10 py-5 bg-[#c5a059] text-white font-hud font-black text-[12px] tracking-[0.4em] rounded-sm hover:bg-slate-900 transition-all shadow-xl active:scale-95">ESTABLECER_VÍNCULO</button>
               </div>
               {status === 'SIN_API_KEY' && <p className="text-red-500 text-[9px] font-hud font-black uppercase tracking-widest">Error: API_KEY no detectada en el núcleo</p>}
            </div>
          ) : (
            <>
              <div>
                <p className={`text-[11px] font-hud text-slate-400 font-black tracking-[0.3em] uppercase mb-8 ${isOnLeft ? 'text-right' : ''}`}>Frecuencia Cognitiva</p>
                <div className="h-24 flex items-center justify-center gap-2 px-4">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className={`w-1 rounded-full bg-[#c5a059] transition-all duration-150 ${isSpeaking ? 'opacity-100 shadow-[0_0_10px_#c5a059]' : 'opacity-20'}`} style={{ height: isSpeaking ? `${Math.random() * 80 + 10}px` : '8px'}} />
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-6 border border-slate-100 rounded-3xl shadow-inner min-h-[100px] flex items-center justify-center text-center border-l-8 border-l-[#c5a059] mt-4">
                <p className="text-[14px] text-slate-800 italic font-bold leading-snug">
                  {isSpeaking ? "Nylah está hablando..." : lastInputText ? `"${lastInputText}"` : "Escuchando... Háblele a Nylah ahora."}
                </p>
              </div>
              <div className="mt-8">
                <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white font-hud text-[12px] font-black tracking-[0.5em] hover:bg-red-800 transition-all rounded-sm shadow-lg">FINALIZAR_SESIÓN</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
