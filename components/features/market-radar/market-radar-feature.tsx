'use client';

import { useState, useMemo } from 'react';
import {
  Radar as RadarIcon,
  Search,
  Sparkles,
  MapPin,
  Clock,
  Lightbulb,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { PageHeader, SectionCard, EmptyState } from '@/components/shared/page-header';
import { RelevanceBadge } from '@/components/shared/status-badges';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/hooks/use-store';
import { ZONES } from '@/lib/mock-data';
import { formatDate } from '@/lib/format';
import type { SignalCategory } from '@/lib/types';

const CATEGORIES: (SignalCategory | 'all')[] = [
  'all',
  'Tendencia',
  'Necesidad',
  'Intención de compra',
  'Tema emergente',
  'Queja',
];

const categoryTone: Record<string, 'blue' | 'violet' | 'teal' | 'amber' | 'red'> = {
  Tendencia: 'blue',
  Necesidad: 'violet',
  'Intención de compra': 'teal',
  'Tema emergente': 'amber',
  Queja: 'red',
};

const categoryClass: Record<string, string> = {
  Tendencia: 'bg-primary/15 text-primary ring-primary/30',
  Necesidad: 'bg-secondary/15 text-secondary ring-secondary/30',
  'Intención de compra': 'bg-accent/15 text-accent ring-accent/30',
  'Tema emergente': 'bg-warning/15 text-warning ring-warning/30',
  Queja: 'bg-destructive/15 text-destructive ring-destructive/30',
};

export function MarketRadarFeature() {
  const store = useStore();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [zone, setZone] = useState<string>('all');

  const filtered = useMemo(
    () =>
      store.signals.filter((s) => {
        const matchesKeyword =
          !keyword ||
          s.description.toLowerCase().includes(keyword.toLowerCase()) ||
          s.keyword.toLowerCase().includes(keyword.toLowerCase());
        const matchesCategory = category === 'all' || s.category === category;
        const matchesZone = zone === 'all' || s.location === zone;
        return matchesKeyword && matchesCategory && matchesZone;
      }),
    [store.signals, keyword, category, zone]
  );

  const trends = store.signals.filter((s) => s.category === 'Tendencia' || s.category === 'Tema emergente').slice(0, 4);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Market Radar"
        subtitle="Inteligencia de mercado · tendencias, necesidades y señales (demo)"
        icon={RadarIcon}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Busca palabras clave: hamburguesa, smash, membresía, delivery…"
              className="h-11 pl-9 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 flex-1 gap-2 border-input bg-muted/30">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c === 'all' ? 'Todas las categorías' : c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger className="h-11 w-[150px] gap-2 border-input bg-muted/30">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Zona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
              <SelectItem value="Medellín">Medellín</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Tendencias y temas emergentes" description="Top señales detectadas" className="lg:col-span-1">
          <div className="space-y-2">
            {trends.map((t) => (
              <div key={t.id} className="flex items-center gap-2 rounded-lg bg-muted/20 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{t.keyword}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.location}</p>
                </div>
                <RelevanceBadge relevance={t.relevance} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Análisis generado por IA"
          description="Síntesis de señales (demo)"
          className="lg:col-span-2"
        >
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-foreground">Insight de mercado</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Se detectan <span className="font-medium text-foreground">{store.signals.length} señales</span> relevantes en las últimas 2 semanas. El tema <span className="text-primary">"smash burger"</span> crece 32% en menciones y la <span className="text-primary">intención de compra de combos familiares</span> se concentra en Belén. Se sugieren campañas de producto en Laureles y delivery en El Poblado para fines de semana.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary/15 px-2.5 py-1 text-xs text-secondary">Smash burger +32%</span>
              <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs text-accent">Combos familiares Belén</span>
              <span className="rounded-full bg-warning/15 px-2.5 py-1 text-xs text-warning">Delivery fines de semana</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Señales detectadas <span className="text-muted-foreground">· {filtered.length}</span>
          </h3>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={RadarIcon} title="Sin señales" description="Ajusta los filtros para ver resultados." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <div key={s.id} className="flex flex-col rounded-xl border border-border bg-card/60 p-3 transition-all hover:border-primary/30">
                <div className="mb-2 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${categoryClass[s.category]}`}>
                    {s.category}
                  </span>
                  <RelevanceBadge relevance={s.relevance} />
                </div>
                <p className="text-sm text-foreground">{s.description}</p>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1"><span className="font-medium">Fuente:</span> {s.source}</p>
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.location}</p>
                  <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(s.date)}</p>
                </div>
                <div className="mt-2 rounded-lg bg-accent/5 px-2.5 py-1.5 ring-1 ring-inset ring-accent/20">
                  <p className="flex items-center gap-1 text-[11px] font-medium text-accent">
                    <Lightbulb className="h-3 w-3" /> Oportunidad sugerida
                  </p>
                  <p className="mt-0.5 text-xs text-foreground/80">{s.suggestedOpportunity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}