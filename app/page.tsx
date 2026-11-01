'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { DashboardFeature } from '@/components/features/dashboard/dashboard-feature';
import { ClientsFeature } from '@/components/features/clients/clients-feature';
import { CompetitorsFeature } from '@/components/features/competitors/competitors-feature';
import { MarketRadarFeature } from '@/components/features/market-radar/market-radar-feature';
import { GeoIntelligenceFeature } from '@/components/features/geo-intelligence/geo-intelligence-feature';
import { OpportunitiesFeature } from '@/components/features/opportunities/opportunities-feature';
import { LeadsFeature } from '@/components/features/leads/leads-feature';
import { CampaignsFeature } from '@/components/features/campaigns/campaigns-feature';
import { AiAssistantFeature } from '@/components/features/ai-assistant/ai-assistant-feature';
import { AnalyticsFeature } from '@/components/features/analytics/analytics-feature';
import { SettingsFeature } from '@/components/features/settings/settings-feature';
import type { NavKey } from '@/lib/types';

export default function Home() {
  const [active, setActive] = useState<NavKey>('dashboard');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const valid: NavKey[] = ['dashboard', 'clients', 'competitors', 'market-radar', 'geo', 'opportunities', 'leads', 'campaigns', 'ai-assistant', 'analytics', 'settings'];
      if (valid.includes(hash as NavKey)) setActive(hash as NavKey);
    }
  }, []);

  function navigate(key: NavKey) {
    setActive(key);
    window.location.hash = key;
  }

  return (
    <AppShell active={active} onNavigate={navigate}>
      {active === 'dashboard' && <DashboardFeature onNavigate={navigate} />}
      {active === 'clients' && <ClientsFeature />}
      {active === 'competitors' && <CompetitorsFeature />}
      {active === 'market-radar' && <MarketRadarFeature />}
      {active === 'geo' && <GeoIntelligenceFeature />}
      {active === 'opportunities' && <OpportunitiesFeature />}
      {active === 'leads' && <LeadsFeature />}
      {active === 'campaigns' && <CampaignsFeature />}
      {active === 'ai-assistant' && <AiAssistantFeature />}
      {active === 'analytics' && <AnalyticsFeature />}
      {active === 'settings' && <SettingsFeature />}
    </AppShell>
  );
}