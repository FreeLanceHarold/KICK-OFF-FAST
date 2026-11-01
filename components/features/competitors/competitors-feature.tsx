'use client';

import { useState, useMemo } from 'react';
import {
  Swords,
  Search,
  ArrowLeft,
  TrendingUp,
  Users,
  Calendar,
  Tag,
  Eye,
  Plus,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { PageHeader, SectionCard, EmptyState } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badges';
import { BarsChart, DonutChart } from '@/components/shared/charts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/hooks/use-store';
import { formatNumber, formatDate, initials } from '@/lib/format';
import type { Competitor, CompetitorStrength } from '@/lib/types';

const strengthTone: Record<CompetitorStrength, 'red' | 'amber' | 'gray'> = {
  Alto: 'red',
  Medio: 'amber',
  Bajo: 'gray',
};

export function CompetitorsFeature() {
  const store = useStore();
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const zones = Array.from(new Set(store.competitors.map((c) => c.zone)));

  const filtered = store.competitors.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesZone = zoneFilter === 'all' || c.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const selected = store.competitors.find((c) => c.id === selectedId) ?? null;

  const compareData = useMemo(
    () =>
      store.competitors
        .filter((c) => compareIds.includes(c.id))
        .map((c) => ({ name: c.name.split(' ')[0], followers: c.followers, engagement: c.engagementRate * 100, frequency: c.postingFrequency })),
    [store.competitors, compareIds]
  );

  if (view === 'detail' && selected) {
    return <CompetitorDetail competitor={selected} onBack={() => setView('list')} />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inteligencia competitiva"
        subtitle="Centro de investigación de la competencia (datos demo)"
        icon={Swords}
        actions={
          <>
            <Button
              variant={compareMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCompareMode((m) => !m);
                setCompareIds([]);
              }}
            >
              <Activity className="h-4 w-4" /> {compareMode ? 'Salir de comparar' : 'Comparar'}
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar competidores…" className="pl-8" />
        </div>
        <Select value={zoneFilter} onValueChange={setZoneFilter}>
          <SelectTrigger className="h-10 w-[180px] gap-2 border-input bg-muted/30">
            <SelectValue placeholder="Zona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las zonas</SelectItem>
            {zones.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {compareMode && (
        <SectionCard title="Comparación de competidores" description="Selecciona 2 o más para comparar">
          {compareData.length >= 2 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Seguidores</p>
                <BarsChart data={compareData} series={[{ key: 'followers', color: 'hsl(217 91% 60%)' }]} height={200} />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Engagement & frecuencia</p>
                <BarsChart data={compareData} series={[{ key: 'engagement', color: 'hsl(174 74% 50%)' }, { key: 'frequency', color: 'hsl(258 90% 66%)' }]} height={200} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Selecciona al menos 2 competidores marcando la casilla en cada tarjeta.</p>
          )}
        </SectionCard>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon={Swords} title="Sin competidores" description="Ajusta los filtros para ver resultados." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`group relative cursor-pointer rounded-xl border bg-card/60 p-4 transition-all hover:border-primary/30 ${compareIds.includes(c.id) ? 'border-primary ring-1 ring-primary/30' : 'border-border'}`}
              onClick={() => {
                if (compareMode) {
                  setCompareIds((ids) => (ids.includes(c.id) ? ids.filter((id) => id !== c.id) : [...ids, c.id]));
                } else {
                  setSelectedId(c.id);
                  setView('detail');
                }
              }}
            >
              {compareMode && (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded border border-border">
                  {compareIds.includes(c.id) && <span className="text-primary">✓</span>}
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-secondary/15 text-xs font-semibold text-secondary">
                    {initials(c.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.zone}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/20 px-2.5 py-1.5">
                  <p className="text-muted-foreground">Seguidores</p>
                  <p className="text-sm font-semibold text-foreground">{formatNumber(c.followers)}</p>
                </div>
                <div className="rounded-lg bg-muted/20 px-2.5 py-1.5">
                  <p className="text-muted-foreground">Engagement</p>
                  <p className="text-sm font-semibold text-foreground">{c.engagementRate}%</p>
                </div>
                <div className="rounded-lg bg-muted/20 px-2.5 py-1.5">
                  <p className="text-muted-foreground">Posts/sem</p>
                  <p className="text-sm font-semibold text-foreground">{c.postingFrequency}</p>
                </div>
                <div className="rounded-lg bg-muted/20 px-2.5 py-1.5">
                  <p className="text-muted-foreground">Fuerza</p>
                  <div className="mt-0.5"><StatusBadge label={c.strength} tone={strengthTone[c.strength]} /></div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {c.topCategories.slice(0, 3).map((cat) => (
                  <span key={cat} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{cat}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CompetitorDetail({ competitor, onBack }: { competitor: Competitor; onBack: () => void }) {
  const observationTone = { Alto: 'red', Medio: 'amber', Bajo: 'gray' } as const;

  const followersData = competitor.socials.map((s) => ({ name: s.platform, value: s.followers, color: 'hsl(217 91% 60%)' }));

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a competidores
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarFallback className="bg-secondary/15 text-base font-semibold text-secondary">{initials(competitor.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{competitor.name}</h1>
            <p className="text-sm text-muted-foreground">{competitor.zone} · {competitor.address}</p>
          </div>
        </div>
        <StatusBadge label={`Fuerza ${competitor.strength}`} tone={strengthTone[competitor.strength]} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat label="Seguidores totales" value={formatNumber(competitor.followers)} icon={Users} />
        <MiniStat label="Engagement" value={`${competitor.engagementRate}%`} icon={TrendingUp} />
        <MiniStat label="Posts/semana" value={`${competitor.postingFrequency}`} icon={Calendar} />
        <MiniStat label="Promociones activas" value={competitor.promotions.length} icon={Tag} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Perfiles sociales" description="Métricas disponibles" className="lg:col-span-1">
          <div className="space-y-2">
            {competitor.socials.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.platform}</p>
                  <p className="text-xs text-muted-foreground">{s.handle}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">{formatNumber(s.followers)}</p>
              </div>
            ))}
            {followersData.length > 0 && (
              <div className="pt-2">
                <DonutChart data={followersData.map((d, i) => ({ ...d, color: ['hsl(217 91% 60%)', 'hsl(258 90% 66%)', 'hsl(174 74% 50%)'][i % 3] }))} height={180} innerRadius={40} outerRadius={65} />
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Historial de observaciones" description="Registro de actividad" className="lg:col-span-2" bodyClassName="p-0">
          <div className="divide-y divide-border">
            {competitor.observations.map((o) => (
              <div key={o.id} className="flex gap-3 px-4 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Eye className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">{o.type}</span>
                    <StatusBadge label={o.impact} tone={observationTone[o.impact]} />
                    <span className="text-[10px] text-muted-foreground/70">{formatDate(o.date)}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{o.note}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Promociones identificadas" description="Campañas activas del competidor">
          {competitor.promotions.length === 0 ? (
            <EmptyState icon={Tag} title="Sin promociones" />
          ) : (
            <div className="space-y-2">
              {competitor.promotions.map((p) => (
                <div key={p.id} className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.channel} · {formatDate(p.start)} → {formatDate(p.end)}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Análisis de contenido" description="Categorías principales">
          <div className="flex flex-wrap gap-2">
            {competitor.topCategories.map((cat) => (
              <span key={cat} className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary">{cat}</span>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/10 p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-accent" />
              <p className="text-xs font-medium text-foreground">Análisis IA (demo)</p>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {competitor.name} mantiene una frecuencia de {competitor.postingFrequency} publicaciones por semana con un engagement del {competitor.engagementRate}%. Las promociones se concentran en {competitor.topCategories.join(', ')}. Se recomienda reforzar contenido de producto en {competitor.zone}.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Users }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}