'use client';

import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  ArrowLeft,
  LayoutGrid,
  Rows3,
  MapPin,
  Phone,
  Mail,
  Plus,
  MessageSquare,
  Calendar,
  ShieldCheck,
  ShieldX,
  Activity,
} from 'lucide-react';
import { PageHeader, SectionCard, EmptyState } from '@/components/shared/page-header';
import { LeadStatusBadge, ScoreBadge } from '@/components/shared/status-badges';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useStore } from '@/hooks/use-store';
import { useToast } from '@/hooks/use-toast';
import { initials, formatDate, formatDateTime } from '@/lib/format';
import { OPERATORS } from '@/lib/mock-data';
import type { Lead, LeadStatus, LeadSource } from '@/lib/types';

const STATUSES: LeadStatus[] = ['Nuevo', 'Pendiente de contacto', 'Contactado', 'Calificado', 'Convertido', 'Descartado'];
const SOURCES: LeadSource[] = ['Market Radar', 'Geo Intelligence', 'Campaña', 'Formulario', 'Referido', 'Opportunity Engine'];

export function LeadsFeature() {
  const store = useStore();
  const { toast } = useToast();
  const [mode, setMode] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');

  const filtered = useMemo(
    () =>
      store.leads.filter((l) => {
        const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
        const matchesClient = clientFilter === 'all' || l.clientId === clientFilter;
        const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
        const matchesZone = zoneFilter === 'all' || l.zone === zoneFilter;
        return matchesSearch && matchesClient && matchesSource && matchesZone;
      }),
    [store.leads, search, clientFilter, sourceFilter, zoneFilter]
  );

  const selected = store.leads.find((l) => l.id === selectedLeadId) ?? null;
  const zones = Array.from(new Set(store.leads.map((l) => l.zone)));

  function changeStatus(lead: Lead, status: LeadStatus) {
    store.updateLead(lead.id, { status });
    store.addLeadActivity(lead.id, {
      id: `a-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: 'Estado',
      note: `Estado cambiado a ${status}`,
      author: 'Valentina Ríos',
    });
    toast({ title: 'Lead actualizado', description: `${lead.name} → ${status}` });
  }

  function addNote() {
    if (!selected || !newNote.trim()) return;
    store.addLeadActivity(selected.id, {
      id: `a-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: 'Nota',
      note: newNote.trim(),
      author: 'Valentina Ríos',
    });
    setNewNote('');
    toast({ title: 'Nota agregada' });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads CRM"
        subtitle="Gestión visual de prospectos captados (demo)"
        icon={Users}
        actions={
          <div className="flex items-center gap-1 rounded-lg bg-muted/30 p-1">
            <button
              onClick={() => setMode('table')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${mode === 'table' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Rows3 className="h-3.5 w-3.5" /> Tabla
            </button>
            <button
              onClick={() => setMode('kanban')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${mode === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Kanban
            </button>
          </div>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar leads…" className="pl-8" />
        </div>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="h-10 w-[170px] gap-2 border-input bg-muted/30"><SelectValue placeholder="Cliente" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los clientes</SelectItem>
            {store.clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="h-10 w-[150px] gap-2 border-input bg-muted/30"><SelectValue placeholder="Fuente" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las fuentes</SelectItem>
            {SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={zoneFilter} onValueChange={setZoneFilter}>
          <SelectTrigger className="h-10 w-[140px] gap-2 border-input bg-muted/30"><SelectValue placeholder="Zona" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {zones.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {mode === 'table' ? (
        filtered.length === 0 ? (
          <EmptyState icon={Users} title="Sin leads" description="Ajusta los filtros para ver resultados." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card/60">
            <div className="scrollbar-thin overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Lead</th>
                    <th className="px-4 py-2.5 text-left font-medium">Cliente</th>
                    <th className="px-4 py-2.5 text-left font-medium">Fuente</th>
                    <th className="px-4 py-2.5 text-left font-medium">Zona</th>
                    <th className="px-4 py-2.5 text-left font-medium">Score</th>
                    <th className="px-4 py-2.5 text-left font-medium">Responsable</th>
                    <th className="px-4 py-2.5 text-left font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((l) => {
                    const client = store.clients.find((c) => c.id === l.clientId);
                    return (
                      <tr
                        key={l.id}
                        className="cursor-pointer transition-colors hover:bg-muted/20"
                        onClick={() => setSelectedLeadId(l.id)}
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7 border border-border">
                              <AvatarFallback className="bg-primary/15 text-[10px] font-semibold text-primary">{initials(l.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{l.name}</p>
                              <p className="text-xs text-muted-foreground">{l.business ?? l.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{client?.name ?? '—'}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{l.source}</td>
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{l.zone}</span>
                        </td>
                        <td className="px-4 py-2.5"><ScoreBadge score={l.score} /></td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{l.owner}</td>
                        <td className="px-4 py-2.5"><LeadStatusBadge status={l.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <KanbanView leads={filtered} onSelect={setSelectedLeadId} onStatusChange={changeStatus} clients={store.clients} />
      )}

      {/* Panel de detalle */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedLeadId(null)}>
        <SheetContent className="scrollbar-thin w-full overflow-y-auto sm:max-w-[480px]">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">{initials(selected.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base">{selected.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">{selected.business ?? selected.email}</p>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-4 px-1 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <LeadStatusBadge status={selected.status} />
                  <ScoreBadge score={selected.score} />
                  {selected.consent ? (
                    <span className="flex items-center gap-1 text-xs text-success"><ShieldCheck className="h-3.5 w-3.5" /> Consentimiento</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-destructive"><ShieldX className="h-3.5 w-3.5" /> Sin consentimiento</span>
                  )}
                </div>

                <SectionCard title="Información comercial">
                  <dl className="space-y-2 text-sm">
                    <InfoLine icon={Phone} label="Teléfono" value={selected.phone} />
                    <InfoLine icon={Mail} label="Email" value={selected.email} />
                    <InfoLine icon={MapPin} label="Zona" value={selected.zone} />
                    <InfoLine icon={Users} label="Responsable" value={selected.owner} />
                    <InfoLine icon={Activity} label="Fuente" value={selected.source} />
                    {selected.nextFollowUp && <InfoLine icon={Calendar} label="Próximo seguimiento" value={formatDate(selected.nextFollowUp)} />}
                  </dl>
                </SectionCard>

                <SectionCard title="Cambiar estado">
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => changeStatus(selected, s)}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${selected.status === s ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Notas">
                  <p className="text-sm text-muted-foreground">{selected.notes || 'Sin notas.'}</p>
                  <div className="mt-3 flex gap-2">
                    <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Agregar nota…" className="min-h-[60px] text-sm" />
                    <Button size="sm" onClick={addNote} className="shrink-0">Agregar</Button>
                  </div>
                </SectionCard>

                <SectionCard title="Historial de actividad" bodyClassName="p-0">
                  <div className="divide-y divide-border">
                    {selected.activity.map((a) => (
                      <div key={a.id} className="flex gap-3 px-4 py-2.5">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {a.type === 'Llamada' ? <Phone className="h-3 w-3" /> : a.type === 'WhatsApp' || a.type === 'Nota' ? <MessageSquare className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">{a.type}</span>
                            <span className="text-[10px] text-muted-foreground/70">{formatDateTime(a.date)}</span>
                          </div>
                          <p className="mt-1 text-sm text-foreground">{a.note}</p>
                          <p className="text-[10px] text-muted-foreground/70">por {a.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function KanbanView({ leads, onSelect, onStatusChange, clients }: { leads: Lead[]; onSelect: (id: string) => void; onStatusChange: (l: Lead, s: LeadStatus) => void; clients: { id: string; name: string }[] }) {
  const columns = STATUSES.filter((s) => s !== 'Descartado');
  return (
    <div className="scrollbar-thin overflow-x-auto pb-2">
      <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
        {columns.map((status) => {
          const colLeads = leads.filter((l) => l.status === status);
          return (
            <div key={status} className="w-[240px] shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{status}</p>
                <span className="rounded-full bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">{colLeads.length}</span>
              </div>
              <div className="space-y-2 rounded-xl border border-border bg-muted/10 p-2" style={{ minHeight: 200 }}>
                {colLeads.length === 0 && <p className="px-2 py-4 text-center text-xs text-muted-foreground">Sin leads</p>}
                {colLeads.map((l) => {
                  const client = clients.find((c) => c.id === l.clientId);
                  return (
                    <div
                      key={l.id}
                      className="cursor-pointer rounded-lg border border-border bg-card/80 p-2.5 transition-all hover:border-primary/40 hover:shadow-sm"
                      onClick={() => onSelect(l.id)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{l.name}</p>
                        <ScoreBadge score={l.score} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{client?.name ?? '—'}</p>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground"><MapPin className="h-2.5 w-2.5" />{l.zone} · {l.source}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoLine({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}