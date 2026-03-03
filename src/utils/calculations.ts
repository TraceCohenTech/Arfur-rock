import { EventRow } from '@/lib/types';
import { median } from '@/lib/utils';

export interface KPIDataExtended {
  totalEvents: number;
  confirmedEvents: number;
  rumors: number;
  medianDaysEarly: number | null;
  companiesTracked: number;
  totalCapital: number;
}

export interface Headline {
  text: string;
  type: 'confirmed' | 'rumor' | 'datapoint';
}

export interface MonthlyTimelinePoint {
  month: string;
  calls: number;
  confirmed: number;
}

export interface StageBreakdown {
  name: string;
  value: number;
}

export interface TopRound {
  company: string;
  amount: number;
  amountLabel: string;
  stage: string;
  pct: number;
}

export function calcKPIs(events: EventRow[]): KPIDataExtended {
  const nonDatapoint = events.filter((e) => e.scope !== 'market_datapoint');
  const confirmed = events.filter(
    (e) => e.scope === 'called_vs_announced' && e.official_announce_date !== null
  );
  const rumors = events.filter((e) => e.scope === 'rumor_unconfirmed');
  const deltas = confirmed
    .map((e) => e.delta_days_call_to_announce)
    .filter((d): d is number => d !== null && d >= 0);

  const companies = new Set(events.map((e) => e.company));

  const totalCapital = events.reduce((sum, e) => sum + (e.round_amount_num || 0), 0);

  return {
    totalEvents: nonDatapoint.length,
    confirmedEvents: confirmed.length,
    rumors: rumors.length,
    medianDaysEarly: median(deltas),
    companiesTracked: companies.size,
    totalCapital,
  };
}

export function calcMonthlyTimeline(events: EventRow[]): MonthlyTimelinePoint[] {
  const monthMap = new Map<string, { calls: number; confirmed: number }>();

  for (const e of events) {
    if (!e.call_date || e.scope === 'market_datapoint') continue;
    const key = `${e.call_date.getFullYear()}-${String(e.call_date.getMonth() + 1).padStart(2, '0')}`;
    const existing = monthMap.get(key) || { calls: 0, confirmed: 0 };
    existing.calls++;
    if (e.scope === 'called_vs_announced' && e.official_announce_date) {
      existing.confirmed++;
    }
    monthMap.set(key, existing);
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => {
      const [y, m] = month.split('-');
      const date = new Date(parseInt(y), parseInt(m) - 1);
      const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      return { month: label, ...data };
    });
}

export function calcDaysEarlyBuckets(events: EventRow[]) {
  const buckets = [
    { label: '0-7', min: 0, max: 7 },
    { label: '8-30', min: 8, max: 30 },
    { label: '31-90', min: 31, max: 90 },
    { label: '91-180', min: 91, max: 180 },
    { label: '181+', min: 181, max: Infinity },
  ];

  const confirmed = events.filter(
    (e) =>
      e.scope === 'called_vs_announced' &&
      e.official_announce_date !== null &&
      e.delta_days_call_to_announce !== null &&
      e.delta_days_call_to_announce >= 0
  );

  return buckets.map((bucket) => ({
    name: bucket.label,
    count: confirmed.filter(
      (e) =>
        e.delta_days_call_to_announce! >= bucket.min &&
        e.delta_days_call_to_announce! <= bucket.max
    ).length,
  }));
}

export function calcRoundStageBreakdown(events: EventRow[]): StageBreakdown[] {
  const stageMap = new Map<string, number>();

  for (const e of events) {
    if (!e.round_stage || e.scope === 'market_datapoint') continue;
    const stage = normalizeStage(e.round_stage);
    stageMap.set(stage, (stageMap.get(stage) || 0) + 1);
  }

  return Array.from(stageMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function normalizeStage(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (s.includes('seed')) return 'Seed';
  if (s.includes('pre-seed') || s.includes('preseed')) return 'Pre-Seed';
  if (s.includes('series a') || s === 'a') return 'Series A';
  if (s.includes('series b') || s === 'b') return 'Series B';
  if (s.includes('series c') || s === 'c') return 'Series C';
  if (s.includes('series d') || s === 'd') return 'Series D';
  if (s.includes('series e') || s === 'e') return 'Series E';
  if (s.includes('series f') || s === 'f') return 'Series F';
  if (s.includes('ipo') || s.includes('spac')) return 'IPO/SPAC';
  if (s.includes('growth') || s.includes('late')) return 'Growth';
  if (s.includes('debt') || s.includes('credit')) return 'Debt';
  // Capitalize first letter
  return raw.trim().charAt(0).toUpperCase() + raw.trim().slice(1);
}

export function calcTopRounds(events: EventRow[], limit = 10): TopRound[] {
  const withAmount = events
    .filter((e) => e.round_amount_num && e.round_amount_num > 0 && e.scope !== 'market_datapoint')
    .sort((a, b) => (b.round_amount_num || 0) - (a.round_amount_num || 0))
    .slice(0, limit);

  if (withAmount.length === 0) return [];

  const maxAmount = withAmount[0].round_amount_num || 1;

  return withAmount.map((e) => ({
    company: e.company,
    amount: e.round_amount_num || 0,
    amountLabel: e.round_amount || '',
    stage: e.round_stage || '',
    pct: ((e.round_amount_num || 0) / maxAmount) * 100,
  }));
}

export function buildHeadlines(events: EventRow[]): Headline[] {
  const headlines: Headline[] = [];

  // Sort by call_date descending
  const sorted = [...events]
    .filter((e) => e.call_date && e.scope !== 'market_datapoint')
    .sort((a, b) => (b.call_date!.getTime() - a.call_date!.getTime()));

  for (const e of sorted.slice(0, 30)) {
    if (e.scope === 'called_vs_announced' && e.official_announce_date) {
      headlines.push({
        text: `${e.company} round called ${e.delta_days_call_to_announce ? Math.round(e.delta_days_call_to_announce) + ' days' : ''} before announcement${e.round_amount ? ' (' + e.round_amount + ')' : ''}`,
        type: 'confirmed',
      });
    } else if (e.scope === 'rumor_unconfirmed') {
      headlines.push({
        text: `${e.company} fundraise rumored${e.round_stage ? ' — ' + e.round_stage : ''}${e.round_amount ? ' (' + e.round_amount + ')' : ''}`,
        type: 'rumor',
      });
    } else if (e.scope === 'called_vs_announced') {
      headlines.push({
        text: `${e.company} round called${e.round_stage ? ' — ' + e.round_stage : ''}${e.round_amount ? ' (' + e.round_amount + ')' : ''} — awaiting confirmation`,
        type: 'datapoint',
      });
    }
  }

  return headlines;
}

export function formatCompactMoney(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}
