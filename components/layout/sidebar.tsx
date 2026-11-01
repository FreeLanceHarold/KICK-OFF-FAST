'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Swords,
  Radar,
  MapPin,
  Lightbulb,
  Users,
  Megaphone,
  Sparkles,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/shared/brand-logo';
import type { NavKey } from '@/lib/types';

interface NavItem {
  key: NavKey;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'clients', label: 'Clientes', icon: Building2 },
  { key: 'competitors', label: 'Competidores', icon: Swords },
  { key: 'market-radar', label: 'Market Radar', icon: Radar },
  { key: 'geo', label: 'Geo Intelligence', icon: MapPin },
  { key: 'opportunities', label: 'Oportunidades', icon: Lightbulb },
  { key: 'leads', label: 'Leads CRM', icon: Users },
  { key: 'campaigns', label: 'Campañas', icon: Megaphone },
  { key: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Configuración', icon: Settings },
];

export function Sidebar({
  active,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-popover/80 backdrop-blur-xl transition-all duration-300 md:relative md:translate-x-0',
          collapsed ? 'w-[68px]' : 'w-[240px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className={cn('flex h-16 items-center border-b border-border px-3', collapsed && 'justify-center px-0')}>
          <BrandLogo collapsed={collapsed} />
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const isActive = active === item.key;
              const Icon = item.icon;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      onNavigate(item.key);
                      onCloseMobile();
                    }}
                    onMouseEnter={() => setHovered(item.key)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary/15 text-primary ring-1 ring-primary/20'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive && 'text-primary')} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {isActive && !collapsed && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                    {collapsed && hovered === item.key && (
                      <span className="absolute left-full ml-2 z-50 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-foreground shadow-lg">
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-2">
          <button
            onClick={onToggleCollapse}
            className={cn(
              'hidden w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground md:flex',
              collapsed && 'justify-center px-0'
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Contraer</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export { NAV };
export type { NavItem };