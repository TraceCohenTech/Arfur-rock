export type Scope =
  | "called_vs_announced"
  | "rumor_unconfirmed"
  | "market_datapoint"
  | "ArfurRock_34_startups_summary";

export interface EventRow {
  scope: Scope;
  company: string;
  call_date: Date | null;
  call_source_type: string;
  call_note: string;
  round_stage: string;
  round_amount: string;
  round_amount_num: number | null;
  valuation: string;
  valuation_num: number | null;
  official_announce_date: Date | null;
  official_announce_source: string;
  announce_note: string;
  delta_days_call_to_announce: number | null;
}

export interface SummaryRow {
  company: string;
  call_date: Date | null;
  call_note: string;
  call_source_type: string;
  round_amount: string;
  valuation: string;
  round_stage: string;
}

export interface KPIData {
  totalEvents: number;
  confirmedEvents: number;
  rumors: number;
  medianDaysEarly: number | null;
}

export interface FilterState {
  scopes: Scope[];
  confirmedOnly: boolean;
  dateFrom: string;
  dateTo: string;
  search: string;
}

export type SortKey = keyof EventRow;
export type SortDir = "asc" | "desc";

// Extended types for redesign
export interface KPIDataExtended extends KPIData {
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
