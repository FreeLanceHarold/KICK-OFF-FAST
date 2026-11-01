'use client';

import { useState, useMemo } from 'react';
import {
  Megaphone,
  Search,
  Plus,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Target,
  MapPin,
  DollarSign,
  FileText,
  Calendar,
} from 'lucide-react';
import { PageHeader, SectionCard, EmptyState } from '@/components/shared/page-header';
import { CampaignStatusBadge } from '@/components/shared/status-badges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useStore } from '@/hooks/use-store';
import { useToast } from '@/hooks/use-toast';
import { formatCOP, formatDate } from '@/lib/format';
import { ZONES } from '@/lib/mock-data';
import type { Campaign, CampaignStatus, CampaignChannel } from '@/lib/types';

const CHANNELS: CampaignChannel[] = ['Instagram', 'Facebook', 'TikTok', 'Google Ads', 'WhatsApp', 'Email', 'Radio'];
const OBJECTIVES = ['Generación de leads', 'Lanzamiento de producto', 'Incrementar ventas', 'Notoriedad de marca', 'Agendamiento', 'Fidelización'];
const WIZARD_STEPS = [
  { label: 'Cliente', icon: Target },
  { label: 'Objetivo', icon: Target },
  { label: 'Oportunidad', icon: Target },
  { label: 'Público', icon: Target },
  { label: 'Ubicación', icon: MapPin },
  { label: 'Presupuesto', icon: DollarSign },
  { label: 'Contenido', icon: FileText },
  { label: 'Revisar', icon: CheckCircle2 },
];

export function CampaignsFeature() {
  const store = useStore();
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wizardOpen, setWizardOpen] = useState(false);

  const filtered = useMemo(
    () =>
      store.campaigns.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [store.campaigns, search, statusFilter]
  );

  const selected = store.campaigns.find((c) => c.id === selectedId) ?? null;

  if (view === 'detail' && selected) {
    const client = store.clients.find((c) => c.id === selected.clientId);
    const opportunity = store.opportunities.find((o) => o.id === selected.opportunityId);
    const pct = selected.budget > 0 ? Math.round((selected.spent / selected.budget) * 100) : 0;
    const convRate = selected.leads > 0 ? Math.round((selected.conversions / selected.leads) * 100) : 0;
    const cpl = selected.leads > 0 ? Math.round(selected.spent / selected.leads) : 0;
    return (
      <div className="space-y-5">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver a campañas
        </button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{selected.name}</h1>
            <p className="text-sm text-muted-foreground">{client?.name} · {selected.objective}</p>
          </div>
          <CampaignStatusBadge status={selected.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Mini label="Presupuesto" value={formatCOP(selected.budget)} icon={DollarSign} />
          <Mini label="Gastado" value={formatCOP(selected.spent)} icon={DollarSign} />
          <Mini label="Leads" value={selected.leads} icon={Target} />
          <Mini label="Conversiones" value={selected.conversions} icon={CheckCircle2} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard title="Rendimiento del presupuesto">
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Ejecutado</span>
                  <span className="font-medium text-foreground">{pct}% · {formatCOP(selected.spent)} / {formatCOP(selected.budget)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Coste por lead (demo)</p>
                  <p className="text-lg font-bold text-foreground">{formatCOP(cpl)}</p>
                </div>
                <div className="rounded-lg bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Tasa de conversión</p>
                  <p className="text-lg font-bold text-foreground">{convRate}%</p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Detalle">
            <dl className="space-y-2 text-sm">
              <Row label="Fechas" value={`${formatDate(selected.startDate)} → ${formatDate(selected.endDate)}`} />
              <Row label="Zona" value={selected.zone} />
              <Row label="Canales" value={selected.channels.join(', ')} />
              {opportunity && <Row label="Oportunidad" value={opportunity.title} />}
            </dl>
          </SectionCard>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gestión de campañas"
        subtitle="Campañas activas y finalizadas (demo)"
        icon={Megaphone}
        actions={<Button size="sm" onClick={() => setWizardOpen(true)}><Plus className="h-4 w-4" /> Nueva campaña</Button>}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar campañas…" className="pl-8" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-[170px] gap-2 border-input bg-muted/30"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Borrador">Borrador</SelectItem>
            <SelectItem value="Activa">Activa</SelectItem>
            <SelectItem value="Pausada">Pausada</SelectItem>
            <SelectItem value="Finalizada">Finalizada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Megaphone} title="Sin campañas" description="Crea una nueva campaña para empezar." action={<Button size="sm" onClick={() => setWizardOpen(true)}><Plus className="h-4 w-4" /> Nueva campaña</Button>} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const client = store.clients.find((cl) => cl.id === c.clientId);
            const pct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
            return (
              <button
                key={c.id}
                onClick={() => { setSelectedId(c.id); setView('detail'); }}
                className="rounded-xl border border-border bg-card/60 p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{client?.name} · {c.objective}</p>
                  </div>
                  <CampaignStatusBadge status={c.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.channels.map((ch) => (
                    <span key={ch} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{ch}</span>
                  ))}
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>{formatCOP(c.spent)} / {formatCOP(c.budget)}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(c.startDate)}</span>
                  <span><strong className="text-foreground">{c.leads}</strong> leads · <strong className="text-foreground">{c.conversions}</strong> conv.</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <CampaignWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}

function CampaignWizard({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const store = useStore();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    clientId: '',
    objective: OBJECTIVES[0],
    opportunityId: '',
    audience: '',
    zone: ZONES[0],
    budget: 1000000,
    content: '',
    channels: [] as CampaignChannel[],
  });

  const reset = () => {
    setStep(0);
    setForm({ name: '', clientId: '', objective: OBJECTIVES[0], opportunityId: '', audience: '', zone: ZONES[0], budget: 1000000, content: '', channels: [] });
  };

  function next() { setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1)); }
  function back() { setStep((s) => Math.max(s - 1, 0)); }

  function finish() {
    if (!form.clientId) { toast({ title: 'Selecciona un cliente' }); return; }
    const id = `cam-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    store.addCampaign({
      id,
      name: form.name || `Campaña ${form.objective}`,
      clientId: form.clientId,
      objective: form.objective,
      status: 'Borrador',
      budget: form.budget,
      spent: 0,
      channels: form.channels.length ? form.channels : ['Instagram'],
      startDate: today,
      endDate: today,
      leads: 0,
      conversions: 0,
      zone: form.zone,
      opportunityId: form.opportunityId || undefined,
    });
    toast({ title: 'Campaña creada', description: form.name });
    reset();
    onOpenChange(false);
  }

  const clientOpps = store.opportunities.filter((o) => o.clientId === form.clientId);

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>Nueva campaña</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="scrollbar-thin mb-4 flex items-center gap-1 overflow-x-auto pb-1">
          {WIZARD_STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} className="flex items-center gap-1">
                <button
                  onClick={() => i <= step && setStep(i)}
                  className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${active ? 'bg-primary/15 text-primary' : done ? 'text-success' : 'text-muted-foreground'}`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${active ? 'bg-primary text-primary-foreground' : done ? 'bg-success/20 text-success' : 'bg-muted/40'}`}>
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < WIZARD_STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
              </div>
            );
          })}
        </div>

        <div className="min-h-[180px]">
          {step === 0 && (
            <div className="space-y-3">
              <Label>Campaña</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre de la campaña" />
              <Label>Cliente *</Label>
              <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                <SelectTrigger className="gap-2"><SelectValue placeholder="Selecciona cliente" /></SelectTrigger>
                <SelectContent>
                  {store.clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              <Label>Objetivo</Label>
              <Select value={form.objective} onValueChange={(v) => setForm({ ...form, objective: v })}>
                <SelectTrigger className="gap-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OBJECTIVES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <Label>Oportunidad asociada (opcional)</Label>
              <Select value={form.opportunityId} onValueChange={(v) => setForm({ ...form, opportunityId: v })}>
                <SelectTrigger className="gap-2"><SelectValue placeholder="Sin oportunidad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin oportunidad</SelectItem>
                  {clientOpps.map((o) => <SelectItem key={o.id} value={o.id}>{o.title}</SelectItem>)}
                </SelectContent>
              </Select>
              {clientOpps.length === 0 && <p className="text-xs text-muted-foreground">No hay oportunidades para este cliente.</p>}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <Label>Definición de público</Label>
              <Textarea value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} placeholder="Ej. Profesionales 25-40 de Laureles interesados en comida rápida" />
              <Label>Canales</Label>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((ch) => {
                  const sel = form.channels.includes(ch);
                  return (
                    <button key={ch} onClick={() => setForm({ ...form, channels: sel ? form.channels.filter((c) => c !== ch) : [...form.channels, ch] })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${sel ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}>
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <Label>Ubicación / zona</Label>
              <Select value={form.zone} onValueChange={(v) => setForm({ ...form, zone: v })}>
                <SelectTrigger className="gap-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Presupuesto (COP)</Label>
                <span className="text-lg font-bold text-primary">{formatCOP(form.budget)}</span>
              </div>
              <Slider value={[form.budget]} onValueChange={(v) => setForm({ ...form, budget: v[0] })} min={200000} max={5000000} step={100000} />
              <Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
            </div>
          )}
          {step === 6 && (
            <div className="space-y-3">
              <Label>Contenido / mensaje</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Describe el mensaje, copy o creatividad…" className="min-h-[120px]" />
            </div>
          )}
          {step === 7 && (
            <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">Revisión final</p>
              <Review label="Cliente" value={store.clients.find((c) => c.id === form.clientId)?.name ?? '—'} />
              <Review label="Nombre" value={form.name || '—'} />
              <Review label="Objetivo" value={form.objective} />
              <Review label="Oportunidad" value={clientOpps.find((o) => o.id === form.opportunityId)?.title ?? 'Sin asociar'} />
              <Review label="Público" value={form.audience || '—'} />
              <Review label="Zona" value={form.zone} />
              <Review label="Canales" value={form.channels.join(', ') || 'Instagram'} />
              <Review label="Presupuesto" value={formatCOP(form.budget)} />
              <Review label="Contenido" value={form.content || '—'} />
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={back} disabled={step === 0}><ChevronLeft className="h-4 w-4" /> Atrás</Button>
          {step < WIZARD_STEPS.length - 1 ? (
            <Button size="sm" onClick={next}>Siguiente <ChevronRight className="h-4 w-4" /></Button>
          ) : (
            <Button size="sm" onClick={finish}><CheckCircle2 className="h-4 w-4" /> Crear campaña</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Mini({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Target }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-3">
      <div className="flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4" /><span className="text-xs">{label}</span></div>
      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="text-sm font-medium text-foreground">{value}</dd></div>;
}
function Review({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-2 border-b border-border/50 py-1 text-sm"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium text-foreground">{value}</span></div>;
}