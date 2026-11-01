'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  clients as seedClients,
  competitors as seedCompetitors,
  marketSignals as seedSignals,
  opportunities as seedOpportunities,
  leads as seedLeads,
  campaigns as seedCampaigns,
  notifications as seedNotifications,
} from '@/lib/mock-data';
import type {
  Client,
  Competitor,
  MarketSignal,
  Opportunity,
  Lead,
  Campaign,
  NotificationItem,
} from '@/lib/types';

interface StoreState {
  clients: Client[];
  competitors: Competitor[];
  signals: MarketSignal[];
  opportunities: Opportunity[];
  leads: Lead[];
  campaigns: Campaign[];
  notifications: NotificationItem[];
  activeClientId: string | null;
}

const STORAGE_KEY = 'kickoff-fast-store-v1';

function getInitialState(): StoreState {
  return {
    clients: seedClients,
    competitors: seedCompetitors,
    signals: seedSignals,
    opportunities: seedOpportunities,
    leads: seedLeads,
    campaigns: seedCampaigns,
    notifications: seedNotifications,
    activeClientId: seedClients[0]?.id ?? null,
  };
}

let listeners = new Set<() => void>();
let state: StoreState | null = null;

function loadState(): StoreState {
  if (typeof window === 'undefined') return getInitialState();
  if (state) return state;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoreState>;
      const initial = getInitialState();
      state = {
        ...initial,
        ...parsed,
        // ensure new seed items always present
        clients: parsed.clients?.length ? parsed.clients : initial.clients,
        competitors: parsed.competitors?.length ? parsed.competitors : initial.competitors,
        signals: parsed.signals?.length ? parsed.signals : initial.signals,
        opportunities: parsed.opportunities?.length ? parsed.opportunities : initial.opportunities,
        leads: parsed.leads?.length ? parsed.leads : initial.leads,
        campaigns: parsed.campaigns?.length ? parsed.campaigns : initial.campaigns,
        notifications: parsed.notifications?.length ? parsed.notifications : initial.notifications,
      };
      return state;
    }
  } catch {
    // ignore
  }
  state = getInitialState();
  return state;
}

function persist() {
  if (typeof window === 'undefined' || !state) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export function useStore() {
  const [, setTick] = useState(0);
  const current = loadState();

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setActiveClient = useCallback((id: string | null) => {
    if (!state) return;
    state = { ...state, activeClientId: id };
    persist();
  }, []);

  const addClient = useCallback((client: Client) => {
    if (!state) return;
    state = { ...state, clients: [client, ...state.clients] };
    persist();
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    if (!state) return;
    state = {
      ...state,
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    };
    persist();
  }, []);

  const deleteClient = useCallback((id: string) => {
    if (!state) return;
    state = { ...state, clients: state.clients.filter((c) => c.id !== id) };
    persist();
  }, []);

  const updateOpportunity = useCallback((id: string, patch: Partial<Opportunity>) => {
    if (!state) return;
    state = {
      ...state,
      opportunities: state.opportunities.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    };
    persist();
  }, []);

  const updateLead = useCallback((id: string, patch: Partial<Lead>) => {
    if (!state) return;
    state = {
      ...state,
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    };
    persist();
  }, []);

  const addLeadActivity = useCallback(
    (leadId: string, activity: Lead['activity'][number]) => {
      if (!state) return;
      state = {
        ...state,
        leads: state.leads.map((l) =>
          l.id === leadId ? { ...l, activity: [...l.activity, activity] } : l
        ),
      };
      persist();
    },
    []
  );

  const addCampaign = useCallback((campaign: Campaign) => {
    if (!state) return;
    state = { ...state, campaigns: [campaign, ...state.campaigns] };
    persist();
  }, []);

  const updateCampaign = useCallback((id: string, patch: Partial<Campaign>) => {
    if (!state) return;
    state = {
      ...state,
      campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    };
    persist();
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    if (!state) return;
    state = { ...state, campaigns: state.campaigns.filter((c) => c.id !== id) };
    persist();
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    if (!state) return;
    state = {
      ...state,
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    };
    persist();
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    if (!state) return;
    state = {
      ...state,
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    };
    persist();
  }, []);

  const resetDemo = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    state = getInitialState();
    persist();
  }, []);

  return {
    ...current,
    setActiveClient,
    addClient,
    updateClient,
    deleteClient,
    updateOpportunity,
    updateLead,
    addLeadActivity,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemo,
  };
}