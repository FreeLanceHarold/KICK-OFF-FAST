'use client';

import { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Pencil,
  Trash2,
  ExternalLink,
  Instagram,
  Facebook,
} from 'lucide-react';
import { PageHeader, EmptyState, SectionCard } from '@/components/shared/page-header';
import { ClientStatusBadge } from '@/components/shared/status-badges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useStore } from '@/hooks/use-store';
import { useToast } from '@/hooks/use-toast';
import { formatCOP, formatDate, formatNumber, initials } from '@/lib/format';
import { ZONES } from '@/lib/mock-data';
import type { Client, ClientStatus, ClientCategory, SocialHandle } from '@/lib/types';

const CATEGORIES: ClientCategory[] = ['Restaurantes', 'Retail', 'Salud', 'Servicios', 'Educación', 'Inmobiliaria'];
const STATUSES: ClientStatus[] = ['Activo', 'Pausado', 'En prueba', 'Finalizado'];

const emptyForm: Omit<Client, 'id' | 'createdAt' | 'competitors'> = {
  name: '',
  legalName: '',
  sector: 'Restaurantes',
  city: 'Medellín',
  zone: 'Laureles',
  address: '',
  status: 'Activo',
  logoColor: '#3B82F6',
  socials: [],
  website: '',
  phone: '',
  email: '',
  description: '',
  monthlyBudget: 0,
};

export function ClientsFeature() {
  const store = useStore();
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = store.clients.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.sector === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const selected = store.clients.find((c) => c.id === selectedId) ?? null;

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(client: Client) {
    setEditingId(client.id);
    setForm({
      name: client.name,
      legalName: client.legalName ?? '',
      sector: client.sector,
      city: client.city,
      zone: client.zone,
      address: client.address,
      status: client.status,
      logoColor: client.logoColor,
      socials: client.socials,
      website: client.website ?? '',
      phone: client.phone ?? '',
      email: client.email ?? '',
      description: client.description ?? '',
      monthlyBudget: client.monthlyBudget ?? 0,
    });
    setFormOpen(true);
  }

  function save() {
    if (!form.name.trim()) {
      toast({ title: 'Nombre requerido', description: 'El nombre comercial es obligatorio.' });
      return;
    }
    if (editingId) {
      store.updateClient(editingId, form);
      toast({ title: 'Cliente actualizado', description: form.name });
    } else {
      const id = `c-${Date.now()}`;
      store.addClient({
        ...form,
        id,
        createdAt: new Date().toISOString().slice(0, 10),
        competitors: [],
      });
      toast({ title: 'Cliente creado', description: form.name });
    }
    setFormOpen(false);
  }

  function remove(id: string) {
    store.deleteClient(id);
    toast({ title: 'Cliente eliminado' });
  }

  if (view === 'detail' && selected) {
    return <ClientDetail client={selected} onBack={() => setView('list')} onEdit={() => openEdit(selected)} />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gestión de clientes"
        subtitle="Administra los negocios que tu equipo atiende"
        icon={Building2}
        actions={
          <Button size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" /> Nuevo cliente
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o ciudad…"
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-[160px] gap-2 border-input bg-muted/30">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-10 w-[160px] gap-2 border-input bg-muted/30">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los sectores</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Sin clientes que mostrar"
          description="Ajusta los filtros o crea un nuevo cliente para empezar."
          action={<Button size="sm" onClick={openNew}><Plus className="h-4 w-4" /> Nuevo cliente</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card/60">
          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Cliente</th>
                  <th className="px-4 py-2.5 text-left font-medium">Sector</th>
                  <th className="px-4 py-2.5 text-left font-medium">Ciudad / Zona</th>
                  <th className="px-4 py-2.5 text-left font-medium">Redes</th>
                  <th className="px-4 py-2.5 text-left font-medium">Estado</th>
                  <th className="px-4 py-2.5 text-left font-medium">Incorporación</th>
                  <th className="px-4 py-2.5 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="cursor-pointer transition-colors hover:bg-muted/20"
                    onClick={() => {
                      setSelectedId(c.id);
                      setView('detail');
                    }}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 border border-border">
                          <AvatarFallback style={{ backgroundColor: `${c.logoColor}22`, color: c.logoColor }} className="text-xs font-semibold">
                            {initials(c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{c.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{c.email ?? '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{c.sector}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.zone}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        {c.socials.slice(0, 3).map((s, i) => (
                          <span key={i} className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px]">
                            {s.platform.slice(0, 2)}
                          </span>
                        ))}
                        <span className="text-[10px]">{formatNumber(c.socials.reduce((a, b) => a + b.followers, 0))}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5"><ClientStatusBadge status={c.status} /></td>
                    <td className="px-4 py-2.5 text-muted-foreground">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/40 hover:text-foreground">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => remove(c.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ClientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        form={form}
        setForm={setForm}
        onSave={save}
        editing={!!editingId}
      />
    </div>
  );
}

function ClientFormDialog({
  open,
  onOpenChange,
  form,
  setForm,
  onSave,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  form: Omit<Client, 'id' | 'createdAt' | 'competitors'>;
  setForm: React.Dispatch<React.SetStateAction<Omit<Client, 'id' | 'createdAt' | 'competitors'>>>;
  onSave: () => void;
  editing: boolean;
}) {
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const colorOptions = ['#3B82F6', '#8B5CF6', '#2DD4BF', '#F59E0B', '#EC4899', '#22D3EE'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar cliente' : 'Nuevo cliente'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Nombre comercial *</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Hamburguesería Demo" />
          </div>
          <div>
            <Label>Razón social</Label>
            <Input value={form.legalName} onChange={(e) => set('legalName', e.target.value)} />
          </div>
          <div>
            <Label>Sector</Label>
            <Select value={form.sector} onValueChange={(v) => set('sector', v as ClientCategory)}>
              <SelectTrigger className="gap-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ciudad</Label>
            <Input value={form.city} onChange={(e) => set('city', e.target.value)} />
          </div>
          <div>
            <Label>Zona</Label>
            <Select value={form.zone} onValueChange={(v) => set('zone', v)}>
              <SelectTrigger className="gap-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Dirección</Label>
            <Input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Cra. 70 #10-42" />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+57 604…" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="contacto@demo.co" />
          </div>
          <div>
            <Label>Sitio web</Label>
            <Input value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
          </div>
          <div>
            <Label>Presupuesto mensual (COP)</Label>
            <Input
              type="number"
              value={form.monthlyBudget || ''}
              onChange={(e) => set('monthlyBudget', Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div>
            <Label>Estado</Label>
            <Select value={form.status} onValueChange={(v) => set('status', v as ClientStatus)}>
              <SelectTrigger className="gap-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Color de marca</Label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('logoColor', c)}
                  className={`h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-background ${form.logoColor === c ? 'ring-foreground' : 'ring-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Descripción</Label>
            <Input value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave}>{editing ? 'Guardar cambios' : 'Crear cliente'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ClientDetail({ client, onBack, onEdit }: { client: Client; onBack: () => void; onEdit: () => void }) {
  const store = useStore();
  const clientCompetitors = store.competitors.filter((c) => client.competitors.includes(c.id));
  const clientOpps = store.opportunities.filter((o) => o.clientId === client.id);
  const clientLeads = store.leads.filter((l) => l.clientId === client.id);
  const clientCampaigns = store.campaigns.filter((c) => c.clientId === client.id);

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a clientes
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarFallback style={{ backgroundColor: `${client.logoColor}22`, color: client.logoColor }} className="text-base font-semibold">
              {initials(client.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{client.name}</h1>
            <p className="text-sm text-muted-foreground">{client.legalName} · {client.sector}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ClientStatusBadge status={client.status} />
          <Button variant="outline" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /> Editar</Button>
        </div>
      </div>

      <Tabs defaultValue="resumen" className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-muted/30 p-1">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="perfil">Perfil comercial</TabsTrigger>
          <TabsTrigger value="redes">Redes sociales</TabsTrigger>
          <TabsTrigger value="competidores">Competidores</TabsTrigger>
          <TabsTrigger value="investigaciones">Investigaciones</TabsTrigger>
          <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="campanas">Campañas</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="mt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SectionCard title="Información general" className="lg:col-span-2">
              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <InfoRow label="Sector" value={client.sector} />
                <InfoRow label="Ciudad" value={client.city} />
                <InfoRow label="Zona" value={client.zone} />
                <InfoRow label="Dirección" value={client.address} />
                <InfoRow label="Teléfono" value={client.phone ?? '—'} icon={Phone} />
                <InfoRow label="Email" value={client.email ?? '—'} icon={Mail} />
                <InfoRow label="Sitio web" value={client.website ?? '—'} icon={Globe} />
                <InfoRow label="Presupuesto/mes" value={client.monthlyBudget ? formatCOP(client.monthlyBudget) : '—'} />
              </dl>
              {client.description && (
                <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">{client.description}</p>
              )}
            </SectionCard>
            <SectionCard title="Métricas clave">
              <div className="space-y-3">
                <Metric label="Competidores" value={clientCompetitors.length} />
                <Metric label="Oportunidades" value={clientOpps.length} />
                <Metric label="Leads" value={clientLeads.length} />
                <Metric label="Campañas" value={clientCampaigns.length} />
                <Metric label="Incorporación" value={formatDate(client.createdAt)} />
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="perfil" className="mt-4">
          <SectionCard title="Perfil comercial">
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <InfoRow label="Razón social" value={client.legalName ?? '—'} />
              <InfoRow label="Sector" value={client.sector} />
              <InfoRow label="Presupuesto mensual" value={client.monthlyBudget ? formatCOP(client.monthlyBudget) : '—'} />
              <InfoRow label="Estado" value={client.status} />
            </dl>
            <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">{client.description ?? 'Sin descripción.'}</p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="redes" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {client.socials.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState icon={Instagram} title="Sin redes registradas" />
              </div>
            )}
            {client.socials.map((s, i) => (
              <SocialCard key={i} social={s} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competidores" className="mt-4">
          {clientCompetitors.length === 0 ? (
            <EmptyState icon={Building2} title="Sin competidores asociados" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {clientCompetitors.map((c) => (
                <div key={c.id} className="rounded-lg border border-border bg-card/60 p-3">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.zone} · {c.strength}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatNumber(c.followers)} seguidores</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="investigaciones" className="mt-4">
          <SectionCard title="Investigaciones (demo)">
            <EmptyState icon={Search} title="Sin investigaciones registradas" description="Las investigaciones competitivas aparecerán aquí." />
          </SectionCard>
        </TabsContent>

        <TabsContent value="oportunidades" className="mt-4">
          {clientOpps.length === 0 ? (
            <EmptyState icon={Building2} title="Sin oportunidades" />
          ) : (
            <div className="space-y-2">
              {clientOpps.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-lg border border-border bg-card/60 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{o.title}</p>
                    <p className="text-xs text-muted-foreground">{o.zone} · {o.source}</p>
                  </div>
                  <ClientStatusBadge status={o.status as ClientStatus} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leads" className="mt-4">
          {clientLeads.length === 0 ? (
            <EmptyState icon={Building2} title="Sin leads" />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Lead</th>
                    <th className="px-3 py-2 text-left font-medium">Zona</th>
                    <th className="px-3 py-2 text-left font-medium">Score</th>
                    <th className="px-3 py-2 text-left font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clientLeads.map((l) => (
                    <tr key={l.id}>
                      <td className="px-3 py-2 font-medium">{l.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{l.zone}</td>
                      <td className="px-3 py-2">{l.score}</td>
                      <td className="px-3 py-2"><ClientStatusBadge status={l.status as ClientStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="campanas" className="mt-4">
          {clientCampaigns.length === 0 ? (
            <EmptyState icon={Building2} title="Sin campañas" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {clientCampaigns.map((c) => (
                <div key={c.id} className="rounded-lg border border-border bg-card/60 p-3">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.objective} · {c.status}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.leads} leads · {c.conversions} conversiones</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reportes" className="mt-4">
          <SectionCard title="Reportes (demo)">
            <EmptyState icon={Building2} title="Sin reportes generados" description="Los reportes aparecerán aquí cuando estén disponibles." />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Phone }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-muted-foreground/70">{label}</dt>
      <dd className="mt-0.5 flex items-center gap-1.5 text-sm text-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {value}
      </dd>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function SocialCard({ social }: { social: SocialHandle }) {
  const Icon = social.platform === 'Instagram' ? Instagram : social.platform === 'Facebook' ? Facebook : Globe;
  return (
    <div className="rounded-lg border border-border bg-card/60 p-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{social.platform}</p>
          <p className="text-xs text-muted-foreground">{social.handle}</p>
        </div>
      </div>
      <p className="mt-2 text-lg font-bold text-foreground">{formatNumber(social.followers)}</p>
      <p className="text-xs text-muted-foreground">seguidores</p>
    </div>
  );
}