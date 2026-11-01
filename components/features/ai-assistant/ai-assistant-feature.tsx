'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Wand2,
  Lightbulb,
  Megaphone,
  Calendar,
  FileText,
  Target,
} from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/hooks/use-store';
import { aiPromptSuggestions } from '@/lib/mock-data';
import type { ChatMessage } from '@/lib/types';

const suggestionIcons = [Lightbulb, Target, FileText, Wand2, Calendar, Megaphone];

function generateResponse(prompt: string, clientName?: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('competidor') || p.includes('burger house') || p.includes('analiza')) {
    return `Análisis de competidores para ${clientName ?? 'tu cliente'}:\n\n• Burger House Demo lidera en El Poblado con 28.4K seguidores y 4.2% de engagement. Publica 5 veces/semana con foco en lanzamientos.\n• Grill Station Demo tiene el engagement más alto (5.0%) gracias a contenido de parrilla en Reels.\n\nRecomendación: Diferenciarse con smash burger y promociones de delivery en fin de semana, donde la competencia es más débil.`;
  }
  if (p.includes('oportunidad') || p.includes('identifica')) {
    return `Oportunidades detectadas para ${clientName ?? 'tu cliente'}:\n\n1. Smash burger en Laureles (impacto 92, crítica) — tema emergente +32% menciones.\n2. Combo familiar en Belén (impacto 78) — intención de compra detectada.\n3. Delivery fin de semana El Poblado (impacto 71) — picos de búsqueda "hamburguesa cerca".\n\nSugerido priorizar la #1 por impacto y urgencia.`;
  }
  if (p.includes('estrategia')) {
    return `Estrategia propuesta para ${clientName ?? 'tu cliente'}:\n\n• Producto: Lanzar smash burger como producto estrella.\n• Promoción: Combo estudiante en Laureles (15% off con carné).\n• Geo: Reforzar delivery en El Poblado fins de semana con Google Ads geofencing 2km.\n• Contenido: 3 Reels/semana, 1 story diario, UGC con micro-influencers.\n• Presupuesto sugerido: $1.8M COP/mes repartido 60% Instagram, 25% Google Ads, 15% TikTok.`;
  }
  if (p.includes('publicación') || p.includes('publicacion') || p.includes('instagram') || p.includes('post')) {
    return `Propuesta de publicación para ${clientName ?? 'tu cliente'}:\n\n📸 Visual: Smash burger fundida, primer plano, fondo oscuro con luz cálida.\n\n✍️ Copy: "El smash que estabas esperando 🔥 Doble carne, doble queso, cero excusas. ¡Pídelo ya! 🛵"\n\n📍 Ubicación: Laureles\n🏷️ Hashtags: #SmashBurger #HamburguesaMedellin #LaurelesFood #Demo\n⏰ Mejor horario: 12-2pm y 7-9pm`;
  }
  if (p.includes('promoción') || p.includes('promocion')) {
    return `Promoción sugerida para ${clientName ?? 'tu cliente'}:\n\n🔥 "Martes de Smash" — Smash burger + gaseosa a $24.900 COP\n\n• Canal: Instagram Stories + WhatsApp\n• Duración: 4 semanas\n• Segmento: Estudiantes universitarios de Laureles\n• KPI: +20 pedidos/martes\n• Cupón demo: SMASH10`;
  }
  if (p.includes('calendario')) {
    return `Calendario editorial (2 semanas) para ${clientName ?? 'tu cliente'}:\n\nSemana 1:\n• Lun: Reel smash burger (lanzamiento)\n• Mié: Story combo estudiante\n• Vie: UGC cliente comiendo + encuesta\n• Sáb: Carrusel top 3 burgers\n\nSemana 2:\n• Lun: Story promoción martes\n• Mié: Reel preparación parrilla\n• Vie: Testimonio cliente demo\n• Sáb: Sorteo + cupón\n\nFrecuencia: 1 Reel + 4 Stories/día, ajustado a horarios pico.`;
  }
  if (p.includes('oportunidades geográficas') || p.includes('geo') || p.includes('el poblado')) {
    return `Oportunidades geográficas en El Poblado:\n\n• Zona gastronómica con alta densidad de restaurantes (52 negocios).\n• Picos de búsqueda "hamburguesa cerca" los sábados.\n• Competencia Burger House Demo tiene 2x1 los martes — ventana de ataque: jueves-domingo.\n• Recomendación: Google Ads con geofencing 2km + delivery express 25 min.`;
  }
  return `Entendido. Para ${clientName ?? 'tu cliente'}, puedo ayudarte a analizar competidores, identificar oportunidades, crear estrategias, generar publicaciones, diseñar promociones o proponer un calendario editorial. ¿Sobre cuál de estos temas te gustaría profundizar?`;
}

export function AiAssistantFeature() {
  const store = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Hola, soy el asistente de marketing de KICK-OFF FAST. Puedo ayudarte a analizar competidores, identificar oportunidades, crear estrategias y generar contenido para tus clientes. ¿En qué puedo ayudarte hoy?',
      time: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeClient = store.clients.find((c) => c.id === store.activeClientId) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text, time: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const resp: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: generateResponse(text, activeClient?.name),
        time: new Date().toISOString(),
      };
      setMessages((m) => [...m, resp]);
      setThinking(false);
    }, 900);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Marketing Assistant"
        subtitle="Asistente conversacional de inteligencia comercial (respuestas demo)"
        icon={Sparkles}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        {/* Chat */}
        <div className="flex h-[calc(100vh-280px)] min-h-[420px] flex-col overflow-hidden rounded-xl border border-border bg-card/40">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Asistente KICK-OFF</p>
              <p className="text-[10px] text-success">● En línea · demo</p>
            </div>
          </div>

          <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-primary/15 text-primary' : 'bg-gradient-to-br from-primary to-secondary text-white'}`}>
                  {m.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-foreground'}`}>
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl bg-muted/30 px-3.5 py-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu solicitud…"
              className="h-10 flex-1 rounded-lg border border-input bg-muted/30 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || thinking}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Panel lateral */}
        <div className="space-y-3">
          <SectionCard title="Contexto del cliente" description="Asistente enfocado">
            <Select value={store.activeClientId ?? 'all'} onValueChange={(v) => store.setActiveClient(v === 'all' ? null : v)}>
              <SelectTrigger className="gap-2 text-sm"><SelectValue placeholder="Todos los clientes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los clientes</SelectItem>
                {store.clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {activeClient && (
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <p>• Sector: <span className="text-foreground">{activeClient.sector}</span></p>
                <p>• Zona: <span className="text-foreground">{activeClient.zone}</span></p>
                <p>• Competidores: <span className="text-foreground">{activeClient.competitors.length}</span></p>
                <p>• Presupuesto: <span className="text-foreground">{activeClient.monthlyBudget ? `${(activeClient.monthlyBudget / 1000000).toFixed(1)}M COP` : '—'}</span></p>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Sugerencias de prompts" description="Pide algo rápido" bodyClassName="p-2">
            <div className="space-y-1.5">
              {aiPromptSuggestions.map((s, i) => {
                const Icon = suggestionIcons[i % suggestionIcons.length];
                return (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className="flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                  >
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {s}
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}