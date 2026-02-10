
import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: string; // Cambiado de React.ReactNode a string para persistencia
}

export enum AppSection {
  HOME = 'home',
  CATALOG = 'catalog',
  BOOKING = 'booking',
  QUOTE = 'quote',
  CONTACT = 'contact'
}

export interface QuoteFormData {
  name: string;
  email: string;
  serviceType: string;
  description: string;
}

export interface BookingData {
  date: string;
  time: string;
  name: string;
  phone: string;
}

export interface AdminSettings {
  logoUrl: string;
  whatsappNumber: string;
  flowLink: string;
  nylahAvatarUrl: string;
  nylahInstructions: string;
  services: Service[];
}
