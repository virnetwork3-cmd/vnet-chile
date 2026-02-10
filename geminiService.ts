
import { GoogleGenAI, Modality, Type, FunctionDeclaration } from "@google/genai";

export const navigateToFunction: FunctionDeclaration = {
  name: 'navigateTo',
  parameters: {
    type: Type.OBJECT,
    description: 'Navega a una sección específica del sitio web.',
    properties: {
      section: {
        type: Type.STRING,
        description: 'La sección a la que navegar: "catalog", "booking", "quote", "contact", o "home".',
      },
    },
    required: ['section'],
  },
};

export const fillQuoteFormFunction: FunctionDeclaration = {
  name: 'fillQuoteForm',
  parameters: {
    type: Type.OBJECT,
    description: 'Completa automáticamente el formulario de cotización con la información del cliente.',
    properties: {
      name: { type: Type.STRING, description: 'Nombre completo del cliente.' },
      email: { type: Type.STRING, description: 'Correo electrónico.' },
      serviceType: { type: Type.STRING, description: 'Tipo de servicio (Web, Mobile, Software).' },
      description: { type: Type.STRING, description: 'Descripción de lo que el cliente necesita.' },
    },
    required: ['name', 'serviceType'],
  },
};

export const bookSessionFunction: FunctionDeclaration = {
  name: 'bookSession',
  parameters: {
    type: Type.OBJECT,
    description: 'Agenda una reunión en el calendario.',
    properties: {
      date: { type: Type.STRING, description: 'Fecha de la reunión (YYYY-MM-DD).' },
      time: { type: Type.STRING, description: 'Hora de la reunión (HH:MM).' },
      name: { type: Type.STRING, description: 'Nombre del cliente.' },
    },
    required: ['date', 'time', 'name'],
  },
};

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function createPcmBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
