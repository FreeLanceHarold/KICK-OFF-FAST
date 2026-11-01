'use client';

import { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  CheckCheck,
  Lightbulb,
  Users,
  Megaphone,
  Radar,
  Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NAV } from '@/components/layout/sidebar';
import type { NavKey, NotificationItem, Client } from '@/lib/types';
import { initials, relativeTime } from '@/lib/format';

const notifIcon: Record<NotificationItem['type'], typeof Lightbulb> = {
  opportunity: Lightbulb,
  lead: Users,
  campaign: Megaphone,
  signal: Radar,
  system: SettingsIcon,
};

export function Header({
  active,
  onNavigate,
  clients,
  activeClientId,
  onClientChange,
  notifications,
  onMarkAllRead,
  onOpenMobileSidebar,
}: {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  clients: Client[];
  activeClientId: string | null;
  onClientChange: (id: string) => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onOpenMobileSidebar: () => void;
}) {
  const [query, setQuery] = useState('');
  const unread = notifications.filter((n) => !n.read).length;
  const activeLabel = NAV.find((n) => n.key === active)?.label ?? '';
  const activeClient = clients.find((c) => c.id === activeClientId);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={onOpenMobileSidebar}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <nav className="hidden items-center gap-1.5 text-sm sm:flex">
        <span className="text-muted-foreground">Panel</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
        <span className="font-medium text-foreground">{activeLabel}</span>
      </nav>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar clientes, leads, campañas…"
            className="h-9 w-56 rounded-lg border border-input bg-muted/30 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary lg:w-72"
          />
        </div>

        <Select value={activeClientId ?? 'all'} onValueChange={onClientChange}>
          <SelectTrigger className="h-9 w-[170px] gap-2 border-input bg-muted/30 text-sm">
            <SelectValue placeholder="Cliente activo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los clientes</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: c.logoColor }}
                  />
                  {c.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <span className="text-sm font-semibold">Notificaciones</span>
              <button
                onClick={onMarkAllRead}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Marcar todas
              </button>
            </div>
            <div className="scrollbar-thin max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = notifIcon[n.type];
                return (
                  <div
                    key={n.id}
                    className={cn(
                      'flex gap-3 border-b border-border/50 px-3 py-2.5 last:border-0',
                      !n.read && 'bg-primary/5'
                    )}
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground">{n.title}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{n.description}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/70">{relativeTime(n.date)}</p>
                    </div>
                    {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  </div>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted/40">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                  VR
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-xs font-medium text-foreground">Valentina Ríos</p>
                <p className="text-[10px] text-muted-foreground">Marketing Ops</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate('settings')}>Perfil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('settings')}>Preferencias</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}