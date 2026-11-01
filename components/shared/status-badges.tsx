'use client';

import { cn } from '@/lib/utils';
import type {
  ClientStatus,
  OpportunityStatus,
  OpportunityPriority,
  LeadStatus,
  CampaignStatus,
  Relevance,
} from '@/lib/types';

const base =
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset';

const variants: Record<string, string> = {
  blue: 'bg-primary/15 text-primary ring-primary/30',
  violet: 'bg-secondary/15 text-secondary ring-secondary/30',
  teal: 'bg-accent/15 text-accent ring-accent/30',
  amber: 'bg-warning/15 text-warning ring-warning/30',
  red: 'bg-destructive/15 text-destructive ring-destructive/30',
  green: 'bg-success/15 text-success ring-success/30',
  gray: 'bg-muted/40 text-muted-foreground ring-border',
};

export function StatusDot({ className, tone = 'gray' }: { className?: string; tone?: keyof typeof variants }) {
  const toneMap: Record<string, string> = {
    blue: 'bg-primary',
    violet: 'bg-secondary',
    teal: 'bg-accent',
    amber: 'bg-warning',
    red: 'bg-destructive',
    green: 'bg-success',
    gray: 'bg-muted-foreground',
  };
  return <span className={cn('h-1.5 w-1.5 rounded-full', toneMap[tone], className)} />;
}

export function StatusBadge({ label, tone = 'gray', className }: { label: string; tone?: keyof typeof variants; className?: string }) {
  return (
    <span className={cn(base, variants[tone], className)}>
      <StatusDot tone={tone} />
      {label}
    </span>
  );
}

const clientStatusTone: Record<ClientStatus, keyof typeof variants> = {
  Activo: 'green',
  Pausado: 'amber',
  'En prueba': 'blue',
  Finalizado: 'gray',
};

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return <StatusBadge label={status} tone={clientStatusTone[status]} />;
}

const oppStatusTone: Record<OpportunityStatus, keyof typeof variants> = {
  Detectada: 'blue',
  'En evaluación': 'amber',
  Aprobada: 'violet',
  'En ejecución': 'teal',
  Completada: 'green',
};

export function OpportunityStatusBadge({ status }: { status: OpportunityStatus }) {
  return <StatusBadge label={status} tone={oppStatusTone[status]} />;
}

const priorityTone: Record<OpportunityPriority, keyof typeof variants> = {
  Crítica: 'red',
  Alta: 'amber',
  Media: 'blue',
  Baja: 'gray',
};

export function PriorityBadge({ priority }: { priority: OpportunityPriority }) {
  return <StatusBadge label={priority} tone={priorityTone[priority]} />;
}

const leadStatusTone: Record<LeadStatus, keyof typeof variants> = {
  Nuevo: 'blue',
  'Pendiente de contacto': 'amber',
  Contactado: 'violet',
  Calificado: 'teal',
  Convertido: 'green',
  Descartado: 'gray',
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <StatusBadge label={status} tone={leadStatusTone[status]} />;
}

const campaignTone: Record<CampaignStatus, keyof typeof variants> = {
  Borrador: 'gray',
  Activa: 'green',
  Pausada: 'amber',
  Finalizada: 'blue',
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  return <StatusBadge label={status} tone={campaignTone[status]} />;
}

const relevanceTone: Record<Relevance, keyof typeof variants> = {
  Alta: 'red',
  Media: 'amber',
  Baja: 'gray',
};

export function RelevanceBadge({ relevance }: { relevance: Relevance }) {
  return <StatusBadge label={relevance} tone={relevanceTone[relevance]} />;
}

export function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 80 ? 'green' : score >= 60 ? 'blue' : score >= 40 ? 'amber' : 'gray';
  return <StatusBadge label={`${score}`} tone={tone} />;
}