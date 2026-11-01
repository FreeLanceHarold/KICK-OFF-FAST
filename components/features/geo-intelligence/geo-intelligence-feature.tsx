'use client';

import { useMemo, useState } from 'react';
import {
  MapPin,
  Building2,
  Swords,
  Lightbulb,
  Filter,
  Layers,
  Crosshair,
  Store,
  Target,
} from 'lucide-react';
import { PageHeader, SectionCard, EmptyState } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badges';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/hooks/use-store';
import { geoPoints, geoZones } from '@/lib/mock-data';
import { formatNumber } from '@/lib/format';
import type { GeoPoint } from '@/lib/types';

const kindConfig: Record<
  GeoPoint['kind'],
  { color: string; ring: string; label: string; icon: typeof Building2 }
> = {
  client: { color: '#3B82F6', ring: 'ring-primary', label: 'Cliente', icon: Building2 },
  competitor: { color: '#EC4899', ring: 'ring-secondary', label: 'Competidor', icon: Swords },
  zone: { color: '#2DD4BF', ring: 'ring-accent', label: 'Zona', icon: Layers },
  opportunity: { color: '#F59E0B', ring: 'ring-warning', label: 'Oportunidad', icon: Lightbulb },
};

export function GeoIntelligenceFeature() {
  const store = useStore();
  const [selected, setSelected] = useState<GeoPoint | null>(null);
  const [radiusKm, setRadiusKm] = useState(2);
  const [visibleKinds, setVisibleKinds] = useState<Record<GeoPoint['kind'], boolean>>({
    client: true,
    competitor: true,
    zone: false,
    opportunity: true,
  });
  const [zoneFilter, setZoneFilter] = useState('all');

  const points = useMemo(
    () =>
      geoPoints.filter((p) => {
        if (!visibleKinds[p.kind]) return false;
        if (zoneFilter !== 'all' && p.zone !== zoneFilter) return false;
        return true;
      }),
    [visibleKinds, zoneFilter]
  );

  // Mapa SVG: Medellín área aproximada. lat 6.17-6.26, lng -75.62 a -75.56
  const latMin = 6.16;
  const latMax = 6.27;
  const lngMin = -75.63;
  const lngMax = -75.55;
  const W = 800;
  const H = 560;

  function project(lat: number, lng: number) {
    const x = ((lng - lngMin) / (lngMax - lngMin)) * W;
    const y = ((latMax - lat) / (latMax - latMin)) * H;
    return { x, y };
  }

  function radiusPx(km: number, lat: number) {
    const center = project(lat, lngMin);
    const edge = project(lat, lngMin + km / 111);
    return Math.abs(edge.x - center.x);
  }

  const zoneColorMap: Record<string, string> = Object.fromEntries(geoZones.map((z) => [z.name, z.color]));

  const selectedRelated = selected?.relatedId
    ? store.clients.find((c) => c.id === selected.relatedId) ??
      store.competitors.find((c) => c.id === selected.relatedId) ??
      store.opportunities.find((o) => o.id === selected.relatedId) ??
      null
    : null;

  const businessCount = points.filter((p) => p.kind === 'client' || p.kind === 'competitor').length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Geo Intelligence"
        subtitle="Mapa interactivo de cobertura comercial en Medellín (demo)"
        icon={MapPin}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        {/* Mapa ~70% */}
        <div className="relative min-h-[480px] overflow-hidden rounded-xl border border-border bg-card/40">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
              </pattern>
              <radialGradient id="zone-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width={W} height={H} fill="url(#grid-pattern)" />
            <rect width={W} height={H} fill="url(#zone-glow)" />

            {/* Río Medellín (decorativo) */}
            <path
              d={`M ${project(6.27, -75.57).x} 0 Q ${project(6.24, -75.585).x} ${H * 0.3} ${project(6.2, -75.59).x} ${H * 0.6} T ${project(6.16, -75.6).x} ${H}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              strokeOpacity="0.12"
              strokeLinecap="round"
            />

            {/* Zonas como áreas suaves */}
            {geoZones.map((z) => {
              const zp = geoPoints.find((p) => p.zone === z.name && p.kind === 'client');
              if (!zp) return null;
              const c = project(zp.lat, zp.lng);
              return (
                <g key={z.id} opacity={zoneFilter === 'all' || zoneFilter === z.name ? 0.18 : 0.06}>
                  <circle cx={c.x} cy={c.y} r={70} fill={z.color} />
                  <circle cx={c.x} cy={c.y} r={50} fill={z.color} opacity={0.4} />
                </g>
              );
            })}

            {/* Radios de cobertura de clientes */}
            {points
              .filter((p) => p.kind === 'client')
              .map((p) => {
                const c = project(p.lat, p.lng);
                const r = radiusPx(radiusKm, p.lat);
                return (
                  <circle
                    key={`r-${p.id}`}
                    cx={c.x}
                    cy={c.y}
                    r={r}
                    fill="none"
                    stroke={kindConfig.client.color}
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                    strokeDasharray="5 4"
                  />
                );
              })}

            {/* Marcadores */}
            {points.map((p) => {
              const c = project(p.lat, p.lng);
              const cfg = kindConfig[p.kind];
              const isSel = selected?.id === p.id;
              return (
                <g
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(p)}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isSel ? 13 : 9}
                    fill={cfg.color}
                    fillOpacity={0.18}
                    className="transition-all"
                  />
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isSel ? 6 : 4.5}
                    fill={cfg.color}
                    stroke="hsl(var(--background))"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                  {isSel && (
                    <text x={c.x} y={c.y - 14} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="600">
                      {p.name.split('·')[0].trim()}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Leyenda flotante */}
          <div className="absolute left-3 top-3 rounded-lg border border-border bg-popover/90 px-3 py-2 backdrop-blur">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Leyenda</p>
            <div className="space-y-1">
              {(['client', 'competitor', 'opportunity'] as const).map((k) => (
                <div key={k} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: kindConfig[k].color }} />
                  {kindConfig[k].label}
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full border-2 border-dashed border-primary" />
                Radio cobertura
              </div>
            </div>
          </div>

          {/* Tarjeta de marcador seleccionado */}
          {selected && (
            <div className="absolute bottom-3 left-3 right-3 max-w-sm rounded-xl border border-border bg-popover/95 p-3 shadow-xl backdrop-blur animate-fade-in sm:right-auto">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${kindConfig[selected.kind].color}22`, color: kindConfig[selected.kind].color }}
                  >
                    {(() => {
                      const Icon = kindConfig[selected.kind].icon;
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {kindConfig[selected.kind].label}
                      {selected.zone && ` · ${selected.zone}`}
                      {selected.category && ` · ${selected.category}`}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>
              {selectedRelated && (
                <div className="mt-2 border-t border-border pt-2">
                  <p className="text-xs text-muted-foreground">
                    {'sector' in selectedRelated ? `Sector: ${selectedRelated.sector}` : ''}
                    {'status' in selectedRelated ? ` · Estado: ${selectedRelated.status}` : ''}
                  </p>
                  {('description' in selectedRelated && selectedRelated.description) && (
                    <p className="mt-1 text-xs text-foreground/80">{selectedRelated.description}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="space-y-3">
          <SectionCard title="Filtros del mapa" description="Capas y radio">
            <div className="space-y-3">
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Capas visibles</p>
                <div className="space-y-1.5">
                  {(Object.keys(kindConfig) as GeoPoint['kind'][]).map((k) => (
                    <label key={k} className="flex cursor-pointer items-center gap-2 text-sm">
                      <button
                        onClick={() => setVisibleKinds((v) => ({ ...v, [k]: !v[k] }))}
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          visibleKinds[k] ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                        }`}
                      >
                        {visibleKinds[k] && <span className="text-[10px]">✓</span>}
                      </button>
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: kindConfig[k].color }}
                      />
                      {kindConfig[k].label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Radio de cobertura</p>
                  <span className="text-xs font-semibold text-primary">{radiusKm} km</span>
                </div>
                <Slider value={[radiusKm]} onValueChange={(v) => setRadiusKm(v[0])} min={1} max={8} step={1} />
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Zona</p>
                <Select value={zoneFilter} onValueChange={setZoneFilter}>
                  <SelectTrigger className="h-9 gap-2 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las zonas</SelectItem>
                    {geoZones.map((z) => (
                      <SelectItem key={z.id} value={z.name}>{z.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Resumen de negocios" description="En el área visible">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <p className="text-xs text-muted-foreground">Clientes</p>
                <p className="text-lg font-bold text-primary">{points.filter((p) => p.kind === 'client').length}</p>
              </div>
              <div className="rounded-lg bg-secondary/15 p-2.5">
                <p className="text-xs text-muted-foreground">Competidores</p>
                <p className="text-lg font-bold text-secondary">{points.filter((p) => p.kind === 'competitor').length}</p>
              </div>
              <div className="rounded-lg bg-warning/10 p-2.5">
                <p className="text-xs text-muted-foreground">Oportunidades</p>
                <p className="text-lg font-bold text-warning">{points.filter((p) => p.kind === 'opportunity').length}</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2.5">
                <p className="text-xs text-muted-foreground">Total puntos</p>
                <p className="text-lg font-bold text-foreground">{businessCount + points.filter((p) => p.kind === 'opportunity').length}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Zonas objetivo" description="Priorización comercial" bodyClassName="p-0">
            <div className="divide-y divide-border">
              {geoZones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setZoneFilter(z.name)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-muted/30 ${
                    zoneFilter === z.name ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: z.color }} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{z.name}</p>
                      <p className="text-xs text-muted-foreground">{z.area}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge label={z.priority} tone={z.priority === 'Alta' ? 'red' : z.priority === 'Media' ? 'amber' : 'gray'} />
                    <p className="mt-0.5 text-xs text-muted-foreground">{z.businessCount} negocios</p>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Oportunidades geográficas" description="Sugerencias por zona">
            <div className="space-y-2">
              {store.opportunities.filter((o) => o.status !== 'Completada').slice(0, 4).map((o) => (
                <div key={o.id} className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <p className="text-sm font-medium text-foreground">{o.title}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {o.zone} · {o.source}
                  </p>
                </div>
              ))}
              {store.opportunities.filter((o) => o.status !== 'Completada').length === 0 && (
                <EmptyState icon={Target} title="Sin oportunidades geográficas" />
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground/60">
        <Crosshair className="h-3 w-3" />
        Mapa de demostración · Coordenadas aproximadas de zonas de Medellín · No representa ubicaciones reales de personas
      </p>
    </div>
  );
}