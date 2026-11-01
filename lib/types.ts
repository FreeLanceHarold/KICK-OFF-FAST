// Centralized TypeScript types for KICK-OFF FAST

export type ClientStatus = 'Activo' | 'Pausado' | 'En prueba' | 'Finalizado';
export type ClientCategory = 'Restaurantes' | 'Retail' | 'Salud' | 'Servicios' | 'Educación' | 'Inmobiliaria';

export interface SocialHandle {
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'X' | 'YouTube' | 'LinkedIn';
  handle: string;
  followers: number;
}

export interface Client {
  id: string;
  name: string;
  legalName?: string;
  sector: ClientCategory;
  city: string;
  zone: string;
  address: string;
  status: ClientStatus;
  createdAt: string; // ISO
  logoColor: string;
  socials: SocialHandle[];
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  monthlyBudget?: number;
  competitors: string[]; // competitor ids
}

export type CompetitorStrength = 'Alto' | 'Medio' | 'Bajo';

export interface CompetitorObservation {
  id: string;
  date: string;
  type: 'Publicación' | 'Promoción' | 'Producto' | 'Evento' | 'Comentario';
  note: string;
  impact: CompetitorStrength;
}

export interface Competitor {
  id: string;
  name: string;
  sector: ClientCategory;
  city: string;
  zone: string;
  address: string;
  strength: CompetitorStrength;
  followers: number;
  postingFrequency: number; // posts per week
  engagementRate: number; // %
  topCategories: string[];
  socials: SocialHandle[];
  observations: CompetitorObservation[];
  promotions: { id: string; title: string; start: string; end: string; channel: string }[];
  createdAt: string;
}

export type SignalCategory = 'Tendencia' | 'Necesidad' | 'Intención de compra' | 'Tema emergente' | 'Queja';
export type Relevance = 'Alta' | 'Media' | 'Baja';

export interface MarketSignal {
  id: string;
  description: string;
  source: string;
  date: string;
  category: SignalCategory;
  location: string;
  relevance: Relevance;
  suggestedOpportunity: string;
  keyword: string;
}

export type OpportunityStatus = 'Detectada' | 'En evaluación' | 'Aprobada' | 'En ejecución' | 'Completada';
export type OpportunityPriority = 'Crítica' | 'Alta' | 'Media' | 'Baja';

export interface Opportunity {
  id: string;
  title: string;
  clientId: string;
  competitorId?: string;
  category: string;
  priority: OpportunityPriority;
  status: OpportunityStatus;
  impact: number; // estimated potential impact 0-100
  zone: string;
  source: string;
  aiRecommendation: string;
  evidence: { id: string; type: string; detail: string; date: string }[];
  createdAt: string;
}

export type LeadStatus = 'Nuevo' | 'Pendiente de contacto' | 'Contactado' | 'Calificado' | 'Convertido' | 'Descartado';
export type LeadSource = 'Market Radar' | 'Geo Intelligence' | 'Campaña' | 'Formulario' | 'Referido' | 'Opportunity Engine';

export interface LeadActivity {
  id: string;
  date: string;
  type: 'Llamada' | 'WhatsApp' | 'Email' | 'Visita' | 'Nota' | 'Estado';
  note: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  business?: string;
  email: string;
  phone: string;
  clientId: string;
  status: LeadStatus;
  source: LeadSource;
  zone: string;
  score: number; // 0-100
  owner: string;
  campaignId?: string;
  opportunityId?: string;
  consent: boolean;
  notes: string;
  nextFollowUp?: string;
  createdAt: string;
  activity: LeadActivity[];
}

export type CampaignStatus = 'Borrador' | 'Activa' | 'Pausada' | 'Finalizada';
export type CampaignChannel = 'Instagram' | 'Facebook' | 'TikTok' | 'Google Ads' | 'WhatsApp' | 'Email' | 'Radio';

export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  objective: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  channels: CampaignChannel[];
  startDate: string;
  endDate: string;
  leads: number;
  conversions: number;
  zone: string;
  opportunityId?: string;
}

export type GeoPointKind = 'client' | 'competitor' | 'zone' | 'opportunity';

export interface GeoPoint {
  id: string;
  name: string;
  kind: GeoPointKind;
  lat: number;
  lng: number;
  category?: string;
  zone?: string;
  radius?: number; // meters
  relatedId?: string;
}

export interface GeoZone {
  id: string;
  name: string;
  color: string;
  priority: 'Alta' | 'Media' | 'Baja';
  businessCount: number;
  area: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: 'opportunity' | 'lead' | 'campaign' | 'signal' | 'system';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export type NavKey =
  | 'dashboard'
  | 'clients'
  | 'competitors'
  | 'market-radar'
  | 'geo'
  | 'opportunities'
  | 'leads'
  | 'campaigns'
  | 'ai-assistant'
  | 'analytics'
  | 'settings';
