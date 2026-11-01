'use client';

import { useState, useMemo } from 'react';
import {
  Lightbulb,
  ArrowLeft,
  Search,
  MapPin,
  Sparkles,
  FileSearch as EvidenceIcon,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader, SectionCard, EmptyState } from '@/components/shared/page-header';
import { OpportunityStatusBadge, PriorityBadge } from '@/components/shared/status-badges';
import { RadialScore } from '@/components/shared/charts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/hooks/use-store';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/format';
import type { Opportunity, OpportunityStatus } from '@/lib/types';

const STATUSES: OpportunityStatus[] = ['Detectada', 'En evaluación', 'Aprobada', 'En ejecución', 'Completada'];

export function OpportunitiesFeature() {
  const store = useStore();
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = useMemo(
    () =>
      store.opportunities.filter((o) => {
        const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || o.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
      }),
    [store.opportunities, search, statusFilter, priorityFilter]
  );

  const selected = store.opportunities.find((o) => o.id === selectedId) ?? null;

  function changeStatus(op: Opportunity, status: OpportunityStatus) {
    store.updateOpportunity(op.id, { status });
    toast({ title: 'Estado actualizado', description: `${op.title} → ${status}` });
  }

  if (view === 'detail' && selected) {
    const client = store.clients.find((c) => c.id === selected.clientId);
    const competitor = store.competitors.find((c) => c.id === selected.competitorId);
    return (
      <div className="space-y-5">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver a oportunidades
        </button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning ring-1 ring-warning/20">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{selected.title}</h1>
              <p className="text-sm text-muted-foreground">
                {client?.name ?? '—'} · {selected.category} · {selected.zone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={selected.priority} />
            <OpportunityStatusBadge status={selected.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SectionCard title="Impacto potencial" className="lg:col-span-1">
            <RadialScore value={selected.impact} label="Impacto" color="hsl(38 92% 50%)" height={180} />
            <dl className="mt-2 space-y-1.5 text-sm">
              <Row label="Cliente" value={client?.name ?? '—'} />
              <Row label="Zona" value={selected.zone} />
              <Row label="Fuente" value={selected.source} />
              <Row label="Categoría" value={selected.category} />
              <Row label="Detectada" value={formatDate(selected.createdAt)} />
            </dl>
          </SectionCard>

          <SectionCard
            title="Recomendación de IA"
            description="Sugerencia generada (demo)"
            className="lg:col-span-2"
          >
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm font-semibold text-foreground">Asistente KICK-OFF</p>
              </div>
              <p className="text-sm text-muted-foreground">{selected.aiRecommendation}</p>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Cambiar estado</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(selected, s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      selected.status === s
                        ? 'bg-primary text-primary-foreground ring-1 ring-primary'
                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    {selected.status === s && <CheckCircle2 className="mr-1 inline h-3 w-3" />}
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Evidencias" description="Datos de respaldo de la oportunidad" bodyClassName="p-0">
          <div className="divide-y divide-border">
            {selected.evidence.map((e) => (
              <div key={e.id} className="flex gap-3 px-4 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <EvidenceIcon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">{e.type}</span>
                    <span className="text-[10px] text-muted-foreground/70">{formatDate(e.date)}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{e.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {competitor && (
          <SectionCard title="Competidor relacionado" description={competitor.name}>
            <div className="flex items-center justify-between rounded-lg bg-muted/20 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{competitor.name}</p>
                <p className="text-xs text-muted-foreground">{competitor.zone} · {competitor.strength}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { /* navegar */ }}>
                Ver perfil <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </SectionCard>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Motor de oportunidades"
        subtitle="Bandeja de oportunidades comerciales detectadas (demo)"
        icon={Lightbulb}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar oportunidades…" className="pl-8" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-[170px] gap-2 border-input bg-muted/30">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="h-10 w-[150px] gap-2 border-input bg-muted/30">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Crítica">Crítica</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Media">Media</SelectItem>
            <SelectItem value="Baja">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Lightbulb} title="Sin oportunidades" description="Ajusta los filtros para ver resultados." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card/60">
          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Oportunidad</th>
                  <th className="px-4 py-2.5 text-left font-medium">Cliente</th>
                  <th className="px-4 py-2.5 text-left font-medium">Zona</th>
                  <th className="px-4 py-2.5 text-left font-medium">Impacto</th>
                  <th className="px-4 py-2.5 text-left font-medium">Prioridad</th>
                  <th className="px-4 py-2.5 text-left font-medium">Fuente</th>
                  <th className="px-4 py-2.5 text-left font-medium">Estado</th>
                  <th className="px-4 py-2.5 text-right font-medium">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((o) => {
                  const client = store.clients.find((c) => c.id === o.clientId);
                  return (
                    <tr
                      key={o.id}
                      className="cursor-pointer transition-colors hover:bg-muted/20"
                      onClick={() => { setSelectedId(o.id); setView('detail'); }}
                    >
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-foreground">{o.title}</p>
                        <p className="text-xs text-muted-foreground">{o.category} · {formatDate(o.createdAt)}</p>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{client?.name ?? '—'}</td>
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{o.zone}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-12 rounded-full bg-muted">
                            <div className="h-full rounded-full bg-warning" style={{ width: `${o.impact}%` }} />
                          </div>
                          <span className="text-xs font-medium text-foreground">{o.impact}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5"><PriorityBadge priority={o.priority} /></td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{o.source}</td>
                      <td className="px-4 py-2.5">
                        <Select
                          value={o.status}
                          onValueChange={(v) => { changeStatus(o, v as OpportunityStatus); }}
                        >
                          <SelectTrigger className="h-8 w-[130px] gap-1 border-transparent bg-transparent text-xs hover:bg-muted/40" onClick={(e) => e.stopPropagation()}>
                            <OpportunityStatusBadge status={o.status} />
                          </SelectTrigger>
                          <SelectContent onClick={(e) => e.stopPropagation()}>
                            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedId(o.id); setView('detail'); }}>
                          Ver <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}