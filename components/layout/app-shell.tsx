'use client';

import { useState, useCallback } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Toaster as SonnerToaster } from 'sonner';
import type { NavKey } from '@/lib/types';
import { useStore } from '@/hooks/use-store';

export function AppShell({ children, active, onNavigate }: { children: React.ReactNode; active: NavKey; onNavigate: (key: NavKey) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const store = useStore();

  const handleNavigate = useCallback(
    (key: NavKey) => {
      onNavigate(key);
    },
    [onNavigate]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        active={active}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          active={active}
          onNavigate={handleNavigate}
          clients={store.clients}
          activeClientId={store.activeClientId}
          onClientChange={(id) => store.setActiveClient(id === 'all' ? null : id)}
          notifications={store.notifications}
          onMarkAllRead={store.markAllNotificationsRead}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />
        <main className="scrollbar-thin flex-1 overflow-y-auto bg-grid">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6">{children}</div>
        </main>
      </div>
      <SonnerToaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
    </div>
  );
}