'use client';

import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaTone = 'up',
  tone = 'blue',
  footer,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: string;
  deltaTone?: 'up' | 'down';
  tone?: 'blue' | 'violet' | 'teal' | 'amber' | 'red' | 'green';
  footer?: string;
}) {
  const toneMap: Record<string, string> = {
    blue: 'bg-primary/10 text-primary ring-primary/20',
    violet: 'bg-secondary/15 text-secondary ring-secondary/25',
    teal: 'bg-accent/10 text-accent ring-accent/20',
    amber: 'bg-warning/10 text-warning ring-warning/20',
    red: 'bg-destructive/10 text-destructive ring-destructive/20',
    green: 'bg-success/10 text-success ring-success/20',
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card/60 p-4 shadow-sm transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {delta && (
            <div
              className={cn(
                'mt-1.5 inline-flex items-center gap-1 text-xs font-medium',
                deltaTone === 'up' ? 'text-success' : 'text-destructive'
              )}
            >
              {deltaTone === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {delta}
            </div>
          )}
          {footer && <p className="mt-1.5 text-[11px] text-muted-foreground/70">{footer}</p>}
        </div>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset', toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div
        className={cn(
          'absolute -bottom-px left-0 h-px w-full opacity-60',
          tone === 'blue' && 'bg-gradient-to-r from-primary/40 to-transparent',
          tone === 'violet' && 'bg-gradient-to-r from-secondary/40 to-transparent',
          tone === 'teal' && 'bg-gradient-to-r from-accent/40 to-transparent',
          tone === 'amber' && 'bg-gradient-to-r from-warning/40 to-transparent',
          tone === 'red' && 'bg-gradient-to-r from-destructive/40 to-transparent',
          tone === 'green' && 'bg-gradient-to-r from-success/40 to-transparent'
        )}
      />
    </div>
  );
}