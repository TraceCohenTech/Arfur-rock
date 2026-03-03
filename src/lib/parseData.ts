import Papa from "papaparse";
import { EventRow, SummaryRow, Scope } from "./types";
import { parseMoney, parseDate } from "./utils";

const EVENT_SCOPES: Scope[] = [
  "called_vs_announced",
  "rumor_unconfirmed",
  "market_datapoint",
];

interface RawRow {
  scope: string;
  company: string;
  call_date: string;
  call_source_type: string;
  call_note: string;
  round_amount: string;
  valuation: string;
  round_stage: string;
  official_announce_date: string;
  official_announce_source: string;
  announce_note: string;
  delta_days_call_to_announce: string;
}

export function parseCSVData(csvText: string): {
  events: EventRow[];
  summaries: SummaryRow[];
} {
  const parsed = Papa.parse<RawRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const rawEvents: EventRow[] = [];
  const summaries: SummaryRow[] = [];

  for (const row of parsed.data) {
    const scope = row.scope?.trim() as Scope;

    if (scope === "ArfurRock_34_startups_summary") {
      summaries.push({
        company: row.company?.trim() || "",
        call_date: parseDate(row.call_date),
        call_note: row.call_note?.trim() || "",
        call_source_type: row.call_source_type?.trim() || "",
        round_amount: row.round_amount?.trim() || "",
        valuation: row.valuation?.trim() || "",
        round_stage: row.round_stage?.trim() || "",
      });
    } else if (EVENT_SCOPES.includes(scope)) {
      const callDate = parseDate(row.call_date);
      const delta = row.delta_days_call_to_announce?.trim();
      rawEvents.push({
        scope,
        company: row.company?.trim() || "",
        call_date: callDate,
        call_source_type: row.call_source_type?.trim() || "",
        call_note: row.call_note?.trim() || "",
        round_stage: row.round_stage?.trim() || "",
        round_amount: row.round_amount?.trim() || "",
        round_amount_num: parseMoney(row.round_amount),
        valuation: row.valuation?.trim() || "",
        valuation_num: parseMoney(row.valuation),
        official_announce_date: parseDate(row.official_announce_date),
        official_announce_source: row.official_announce_source?.trim() || "",
        announce_note: row.announce_note?.trim() || "",
        delta_days_call_to_announce:
          delta && delta !== "" ? parseFloat(delta) : null,
      });
    }
  }

  const deduped = deduplicateEvents(rawEvents);
  return { events: deduped, summaries };
}

function deduplicateEvents(rows: EventRow[]): EventRow[] {
  const groups = new Map<string, EventRow[]>();

  for (const row of rows) {
    const dateStr = row.call_date
      ? row.call_date.toISOString().split("T")[0]
      : "";
    const key = `${row.company}|${dateStr}|${row.round_stage}`;
    const existing = groups.get(key) || [];
    existing.push(row);
    groups.set(key, existing);
  }

  const result: EventRow[] = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      result.push(group[0]);
      continue;
    }

    // Prefer rows with official_announce_date
    const withAnnounce = group.filter((r) => r.official_announce_date !== null);
    const candidates = withAnnounce.length > 0 ? withAnnounce : group;

    // If still multiple, keep the one with longest call_note
    candidates.sort((a, b) => b.call_note.length - a.call_note.length);
    result.push(candidates[0]);
  }

  return result;
}
