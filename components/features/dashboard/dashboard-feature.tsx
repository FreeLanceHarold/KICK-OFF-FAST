'use client';

import { useMemo, useState } from 'react';
import {
  Building2,
  Swords,
  Lightbulb,
  Users,
  Megaphone,
  TrendingUp,
  MapPin,
  Activity,
  ArrowRight,
  Clock,
  Radar,
  Target,
} from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { SectionCard, PageHeader } from '@/components/shared/page-header';
import { TrendArea, BarsChart, DualBar, DonutChart } from '@/components/shared/charts';
import { OpportunityStatusBadge, PriorityBadge } from '@/components/shared/status-badges';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useStore } from '@/hooks/use-store';
import {
  leadsEvolution,
  campaignsPerformance,
  opportunitiesDistribution,
  zoneActivity,
  recentActivity,
} from '@/lib/mock-data';
import { formatDate, relativeTime } from '@/lib/format';
import type { NavKey } from '@/lib/types';

const activityIcon: Record<string, typeof Lightbulb> = {
  opportunity: Lightbulb,
  lead: Users,
  campaign: Megaphone,
  signal: Radar,
  competitor: Swords,
};

export function DashboardFeature({ onNavigate }: { onNavigate: (key: NavKey) => void }) {
  const store = useStore();
  const [period, setPeriod] = useState('30d');

  const filteredByClient = useMemo(() => {
    const cid = store.activeClientId;
    if (!cid) return null;
    return store.clients.find((c) => c.id === cid) ?? null;
  }, [store.activeClientId, store.clients]);

  const scopedOpps = useMemo(() => {
    if (!store.activeClientId) return store.opportunities;
    return store.opportunities.filter((o) => o.clientId === store.activeClientId);
  }, [store.opportunities, store.activeClientId]);

  const scopedLeads = useMemo(() => {
    if (!store.activeClientId) return store.leads;
    return store.leads.filter((l) => l.clientId === store.activeClientId);
  }, [store.leads, store.activeClientId]);

  const scopedCampaigns = useMemo(() => {
    if (!store.activeClientId) return store.campaigns;
    return store.campaigns.filter((c) => c.clientId === store.activeClientId);
  }, [store.campaigns, store.activeClientId]);

  const recentOpps = [...scopedOpps].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard ejecutivo"
        subtitle={
          filteredByClient
            ? `Resumen de ${filteredByClient.name}`
            : 'Visión consolidada de todos los clientes'
        }
        icon={TrendingUp}
        actions={
          <>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="h-9 w-[140px] gap-2 border-input bg-muted/30 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => onNavigate('analytics')}>
              Ver analytics <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Clientes activos"
          value={store.clients.filter((c) => c.status === 'Activo').length}
          icon={Building2}
          delta="+2 este mes"
          tone="blue"
        />
        <StatCard
          label="Competidores monitoreados"
          value={store.competitors.length}
          icon={Swords}
          delta="+1 esta semana"
          tone="violet"
        />
        <StatCard
          label="Oportunidades detectadas"
          value={scopedOpps.length}
          icon={Lightbulb}
          delta="+18%"
          tone="amber"
        />
        <StatCard
          label="Leads captados"
          value={scopedLeads.length}
          icon={Users}
          delta="+24%"
          tone="teal"
        />
        <StatCard
          label="Campañas activas"
          value={scopedCampaigns.filter((c) => c.status === 'Activa').length}
          icon={Megaphone}
          delta="+3"
          tone="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          title="Evolución de leads"
          description="Captación y cualificación (datos demo)"
          className="lg:col-span-2"
          action={
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5" /> Demo
            </span>
          }
        >
          <TrendArea
            data={leadsEvolution}
            series={[
              { key: 'leads', color: 'hsl(217 91% 60%)', label: 'Leads' },
              { key: 'qualified', color: 'hsl(174 74% 50%)', label: 'Calificados' },
            ]}
            height={240}
          />
        </SectionCard>

        <SectionCard title="Distribución de oportunidades" description="Por estado actual">
          <DonutChart data={opportunitiesDistribution} height={240} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Rendimiento de campañas" description="Leads y conversiones por campaña" className="lg:col-span-2">
          <BarsChart
            data={campaignsPerformance}
            series={[
              { key: 'leads', color: 'hsl(217 91% 60%)', label: 'Leads' },
              { key: 'conversions', color: 'hsl(142 71% 45%)', label: 'Conversiones' },
            ]}
            height={240}
          />
        </SectionCard>

        <SectionCard title="Actividad por zonas" description="Oportunidades y leads por zona">
          <DualBar
            data={zoneActivity}
            keys={[
              { key: 'oportunidades', color: 'hsl(258 90% 66%)', label: 'Oportunidades' },
              { key: 'leads', color: 'hsl(174 74% 50%)', label: 'Leads' },
            ]}
            height={240}
          />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          title="Oportunidades recientes"
          description="Últimas detectadas"
          className="lg:col-span-2"
          bodyClassName="p-0"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate('opportunities')}>
              Ver todas <ArrowRight className="h-4 w-4" />
            </Button>
          }
        >
          <div className="divide-y divide-border">
            {recentOpps.map((o) => {
              const client = store.clients.find((c) => c.id === o.clientId);
              return (
                <button
                  key={o.id}
                  onClick={() => onNavigate('opportunities')}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{o.title}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{client?.name ?? '—'}</span>
                      <span>·</span>
                      <MapPin className="h-3 w-3" />
                      {o.zone}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <PriorityBadge priority={o.priority} />
                  </div>
                  <OpportunityStatusBadge status={o.status} />
                  <span className="hidden text-[11px] text-muted-foreground/70 md:block">{formatDate(o.createdAt)}</span>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Actividad reciente" description="Operadores y sistema" bodyClassName="p-0">
          <div className="divide-y divide-border">
            {recentActivity.map((a) => {
              const Icon = activityIcon[a.type] ?? Activity;
              return (
                <div key={a.id} className="flex gap-3 px-4 py-2.5">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-foreground">
                      <span className="font-medium">{a.user}</span> {a.action}{' '}
                      <span className="text-primary">{a.target}</span>
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground/70">
                      <Clock className="h-2.5 w-2.5" />
                      {a.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <p className="flex items-center justify-center gap-1.5 pt-2 text-center text-[11px] text-muted-foreground/60">
        <Target className="h-3 w-3" />
        Datos ficticios de demostración para Medellín, Colombia · No representan negocios reales
      </p>
    </div>
  );
}