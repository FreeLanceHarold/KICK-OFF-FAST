'use client';

import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Database,
  RotateCcw,
  Building2,
  Save,
} from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useStore } from '@/hooks/use-store';
import { useToast } from '@/hooks/use-toast';
import { initials } from '@/lib/format';

export function SettingsFeature() {
  const store = useStore();
  const { toast } = useToast();
  const [name, setName] = useState('Valentina Ríos');
  const [email, setEmail] = useState('valentina@kickofffast.demo');
  const [role, setRole] = useState('Marketing Ops');
  const [notifLeads, setNotifLeads] = useState(true);
  const [notifOpps, setNotifOpps] = useState(true);
  const [notifCampaigns, setNotifCampaigns] = useState(false);
  const [notifWeekly, setNotifWeekly] = useState(true);

  function resetDemo() {
    store.resetDemo();
    toast({ title: 'Datos demo reiniciados', description: 'Se restauraron los datos de ejemplo.' });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Configuración"
        subtitle="Perfil del operador y preferencias del sistema"
        icon={SettingsIcon}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Perfil del operador" description="Información personal" action={<User className="h-4 w-4 text-muted-foreground" />}>
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border border-border">
              <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">{initials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Rol</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
          </div>
          <Button size="sm" className="mt-3" onClick={() => toast({ title: 'Perfil guardado' })}>
            <Save className="h-4 w-4" /> Guardar
          </Button>
        </SectionCard>

        <SectionCard title="Notificaciones" description="Preferencias de alertas" action={<Bell className="h-4 w-4 text-muted-foreground" />}>
          <div className="space-y-3">
            <NotifRow label="Nuevos leads" desc="Recibir alerta al captar un lead" checked={notifLeads} onChange={setNotifLeads} />
            <NotifRow label="Oportunidades detectadas" desc="Avisar de nuevas oportunidades" checked={notifOpps} onChange={setNotifOpps} />
            <NotifRow label="Estado de campañas" desc="Notificar cambios de estado" checked={notifCampaigns} onChange={setNotifCampaigns} />
            <NotifRow label="Resumen semanal" desc="Email con resumen de actividad" checked={notifWeekly} onChange={setNotifWeekly} />
          </div>
        </SectionCard>

        <SectionCard title="Datos de demostración" description="Gestión del prototipo" action={<Database className="h-4 w-4 text-muted-foreground" />}>
          <p className="text-sm text-muted-foreground">
            El prototipo guarda cambios temporalmente en tu navegador (localStorage). Puedes reiniciar a los datos de demostración originales en cualquier momento.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetDemo}>
              <RotateCcw className="h-4 w-4" /> Reiniciar datos demo
            </Button>
          </div>
          <div className="mt-3 rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Clientes registrados</span>
              <span className="font-medium text-foreground">{store.clients.length}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>Competidores</span>
              <span className="font-medium text-foreground">{store.competitors.length}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>Campañas</span>
              <span className="font-medium text-foreground">{store.campaigns.length}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>Leads</span>
              <span className="font-medium text-foreground">{store.leads.length}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Apariencia" description="Tema del sistema" action={<Palette className="h-4 w-4 text-muted-foreground" />}>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
              <SettingsIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Tema oscuro</p>
              <p className="text-xs text-muted-foreground">KICK-OFF FAST usa tema oscuro por defecto</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { name: 'Fondo', color: 'hsl(222 47% 7%)' },
              { name: 'Tarjetas', color: 'hsl(221 35% 16%)' },
              { name: 'Primario', color: 'hsl(217 91% 60%)' },
              { name: 'Secundario', color: 'hsl(258 90% 66%)' },
              { name: 'Acento', color: 'hsl(174 74% 50%)' },
              { name: 'Texto', color: 'hsl(210 40% 96%)' },
            ].map((c) => (
              <div key={c.name} className="rounded-lg border border-border p-2">
                <div className="h-8 w-full rounded" style={{ backgroundColor: c.color }} />
                <p className="mt-1 text-[10px] text-muted-foreground">{c.name}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function NotifRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2.5">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}