'use client';

import { useMemo } from 'react';
import {
  BarChart3,
  Target,
  TrendingUp,
  Percent,
  DollarSign,
  Download,
  Activity,
} from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { TrendArea, LineTrend, BarsChart, DualBar, DonutChart } from '@/components/shared/charts';
import { Button } from '@/components/ui/button';
import { useStore } from '@/hooks/use-store';
import {
  leadsEvolution,
  campaignsPerformance,
  channelDistribution,
  zoneActivity,
} from '@/lib/mock-data';
import { formatCOP, formatNumber } from '@/lib/format';

export function AnalyticsFeature() {
  const store = useStore();

  const scopedLeads = useMemo(
    () => (store.activeClientId ? store.leads.filter((l) => l.clientId === store.activeClientId) : store.leads),
    [store.leads, store.activeClientId]
  );
  const scopedCampaigns = useMemo(
    () => (store.activeClientId ? store.campaigns.filter((c) => c.clientId === store.activeClientId) : store.campaigns),
    [store.campaigns, store.activeClientId]
  );

  const totalLeads = scopedLeads.length;
  const qualifiedLeads = scopedLeads.filter((l) => l.status === 'Calificado' || l.status === 'Convertido').length;
  const conversions = scopedLeads.filter((l) => l.status === 'Convertido').length;
  const totalBudget = scopedCampaigns.reduce((a, c) => a + c.budget, 0);
  const totalSpent = scopedCampaigns.reduce((a, c) => a + c.spent, 0);
  const totalCampLeads = scopedCampaigns.reduce((a, c) => a + c.leads, 0);
  const totalConv = scopedCampaigns.reduce((a, c) => a + c.conversions, 0);
  const cpl = totalCampLeads > 0 ? Math.round(totalSpent / totalCampLeads) : 0;
  const convRate = totalCampLeads > 0 ? Math.round((totalConv / totalCampLeads) * 100) : 0;
  const roas = totalSpent > 0 ? (totalConv * 45000 / totalSpent).toFixed(2) : '0';

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analytics"
        subtitle="Dashboard de rendimiento comercial (datos demo)"
        icon={BarChart3}
        actions={
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Exportar</Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Leads captados" value={formatNumber(totalLeads)} icon={TrendingUp} delta="+24%" tone="blue" />
        <StatCard label="Leads calificados" value={formatNumber(qualifiedLeads)} icon={Target} delta="+18%" tone="teal" />
        <StatCard label="Conversiones" value={formatNumber(conversions)} icon={Percent} delta="+12%" tone="green" />
        <StatCard label="Coste por lead" value={formatCOP(cpl)} icon={DollarSign} delta="-8%" deltaTone="up" tone="amber" footer="demo" />
        <StatCard label="Tasa conversión" value={`${convRate}%`} icon={Activity} tone="violet" />
        <StatCard label="ROAS (demo)" value={`${roas}x`} icon={BarChart3} delta="+15%" tone="blue" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Evolución temporal" description="Leads y calificados (demo)" className="lg:col-span-2">
          <TrendArea
            data={leadsEvolution}
            series={[
              { key: 'leads', color: 'hsl(217 91% 60%)', label: 'Leads' },
              { key: 'qualified', color: 'hsl(174 74% 50%)', label: 'Calificados' },
            ]}
            height={240}
          />
        </SectionCard>

        <SectionCard title="Distribución por canales" description="Leads por canal">
          <DonutChart data={channelDistribution} height={240} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Rendimiento por campaña" description="Leads y conversiones">
          <BarsChart
            data={campaignsPerformance}
            series={[
              { key: 'leads', color: 'hsl(217 91% 60%)', label: 'Leads' },
              { key: 'conversions', color: 'hsl(142 71% 45%)', label: 'Conversiones' },
            ]}
            height={240}
          />
        </SectionCard>

        <SectionCard title="Rendimiento por zona" description="Oportunidades y leads geográficos">
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

      <SectionCard title="Evolución de conversión" description="Tendencia de conversiones (demo)">
        <LineTrend
          data={leadsEvolution.map((d) => ({ date: d.date, conversiones: Math.round(d.qualified * 0.6) }))}
          series={[{ key: 'conversiones', color: 'hsl(142 71% 45%)', label: 'Conversiones' }]}
          height={200}
        />
      </SectionCard>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground/60">
        <Activity className="h-3 w-3" />
        Todos los datos son ficticios de demostración · No representan resultados reales
      </p>
    </div>
  );
}