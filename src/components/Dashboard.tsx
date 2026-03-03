"use client";

import { useState, useMemo } from "react";
import { EventRow, SummaryRow, FilterState, KPIData, SortKey, SortDir } from "@/lib/types";
import { median } from "@/lib/utils";
import Header from "./Header";
import KPICards from "./KPICards";
import FilterBar from "./FilterBar";
import TabBar from "./TabBar";
import EventsTable from "./EventsTable";
import SummaryTable from "./SummaryTable";
import DaysEarlyChart from "./DaysEarlyChart";
import DetailDrawer from "./DetailDrawer";
import Footer from "./Footer";

// Serialized types from server
interface SerializedEvent extends Omit<EventRow, "call_date" | "official_announce_date"> {
  call_date: string | null;
  official_announce_date: string | null;
}

interface SerializedSummary extends Omit<SummaryRow, "call_date"> {
  call_date: string | null;
}

interface Props {
  rawEvents: SerializedEvent[];
  rawSummaries: SerializedSummary[];
}

export default function Dashboard({ rawEvents, rawSummaries }: Props) {
  // Hydrate dates
  const events: EventRow[] = useMemo(
    () =>
      rawEvents.map((e) => ({
        ...e,
        call_date: e.call_date ? new Date(e.call_date) : null,
        official_announce_date: e.official_announce_date
          ? new Date(e.official_announce_date)
          : null,
      })),
    [rawEvents]
  );

  const summaries: SummaryRow[] = useMemo(
    () =>
      rawSummaries.map((s) => ({
        ...s,
        call_date: s.call_date ? new Date(s.call_date) : null,
      })),
    [rawSummaries]
  );

  // State
  const [tab, setTab] = useState<"events" | "summary">("events");
  const [filters, setFilters] = useState<FilterState>({
    scopes: [],
    confirmedOnly: false,
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  const [sortKey, setSortKey] = useState<SortKey>("delta_days_call_to_announce");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [drawerRow, setDrawerRow] = useState<EventRow | null>(null);

  // Filtered events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Scope filter
    if (filters.scopes.length > 0) {
      result = result.filter((e) => filters.scopes.includes(e.scope));
    }

    // Confirmed only
    if (filters.confirmedOnly) {
      result = result.filter(
        (e) =>
          e.scope === "called_vs_announced" &&
          e.official_announce_date !== null
      );
    }

    // Date range
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      result = result.filter(
        (e) => e.call_date && e.call_date >= from
      );
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59);
      result = result.filter(
        (e) => e.call_date && e.call_date <= to
      );
    }

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.company.toLowerCase().includes(q) ||
          e.call_note.toLowerCase().includes(q) ||
          e.official_announce_source.toLowerCase().includes(q)
      );
    }

    return result;
  }, [events, filters]);

  // Sorted events
  const sortedEvents = useMemo(() => {
    const sorted = [...filteredEvents];

    sorted.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      // Handle nulls — push to bottom
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      let cmp = 0;
      if (aVal instanceof Date && bVal instanceof Date) {
        cmp = aVal.getTime() - bVal.getTime();
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }

      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [filteredEvents, sortKey, sortDir]);

  // KPIs
  const kpis: KPIData = useMemo(() => {
    const nonDatapoint = events.filter(
      (e) => e.scope !== "market_datapoint"
    );
    const confirmed = events.filter(
      (e) =>
        e.scope === "called_vs_announced" &&
        e.official_announce_date !== null
    );
    const rumors = events.filter(
      (e) => e.scope === "rumor_unconfirmed"
    );
    const deltas = confirmed
      .map((e) => e.delta_days_call_to_announce)
      .filter((d): d is number => d !== null && d >= 0);

    return {
      totalEvents: nonDatapoint.length,
      confirmedEvents: confirmed.length,
      rumors: rumors.length,
      medianDaysEarly: median(deltas),
    };
  }, [events]);

  // Sort handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <>
      <Header />
      <KPICards kpis={kpis} />

      <TabBar
        active={tab}
        onChange={setTab}
        eventCount={events.length}
        summaryCount={summaries.length}
      />

      {tab === "events" ? (
        <>
          <FilterBar filters={filters} onChange={setFilters} />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2">
              <EventsTable
                data={sortedEvents}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                onRowClick={setDrawerRow}
              />
            </div>
            <div>
              <DaysEarlyChart events={events} />
            </div>
          </div>
        </>
      ) : (
        <SummaryTable data={summaries} />
      )}

      <Footer />
      <DetailDrawer row={drawerRow} onClose={() => setDrawerRow(null)} />
    </>
  );
}
