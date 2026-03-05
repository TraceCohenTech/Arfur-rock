"use client";

import { useState, useMemo } from "react";
import { EventRow, SummaryRow, FilterState, SortKey, SortDir } from "@/lib/types";
import {
  calcKPIs,
  calcMonthlyTimeline,
  calcRoundStageBreakdown,
  calcTopRounds,
  buildHeadlines,
} from "@/utils/calculations";
import { CompanyIntel } from "@/lib/parseCompanyIntel";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Trophy,
  Table2,
  Building2,
} from "lucide-react";
import Header from "./Header";
import HeadlinesTicker from "./HeadlinesTicker";
import KPICards from "./KPICards";
import SectionHeader from "./SectionHeader";
import CallTimelineChart from "./CallTimelineChart";
import DaysEarlyChart from "./DaysEarlyChart";
import RoundStageDonut from "./RoundStageDonut";
import TopRoundsList from "./TopRoundsList";
import EventsTable from "./EventsTable";

import CompanyIntelGrid from "./CompanyIntelGrid";
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
  companyIntel: CompanyIntel[];
}

export default function Dashboard({ rawEvents, rawSummaries, companyIntel }: Props) {
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

  // State
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

    if (filters.scopes.length > 0) {
      result = result.filter((e) => filters.scopes.includes(e.scope));
    }

    if (filters.confirmedOnly) {
      result = result.filter(
        (e) =>
          e.scope === "called_vs_announced" &&
          e.official_announce_date !== null
      );
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      result = result.filter((e) => e.call_date && e.call_date >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59);
      result = result.filter((e) => e.call_date && e.call_date <= to);
    }

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

  // KPIs (extended)
  const kpis = useMemo(() => calcKPIs(events), [events]);

  // Derived data
  const headlines = useMemo(() => buildHeadlines(events), [events]);
  const monthlyTimeline = useMemo(() => calcMonthlyTimeline(events), [events]);
  const roundStageBreakdown = useMemo(() => calcRoundStageBreakdown(events), [events]);
  const topRounds = useMemo(() => calcTopRounds(events), [events]);

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
      {/* 1. Gradient Hero Header */}
      <Header kpis={kpis} />

      {/* 2. Headlines Ticker */}
      <HeadlinesTicker headlines={headlines} />

      {/* 3. KPI Cards */}
      <KPICards kpis={kpis} />

      {/* 4. Call Timeline */}
      <SectionHeader
        title="Call Timeline"
        subtitle="Monthly call activity over time"
        icon={<TrendingUp className="w-5 h-5" />}
      />
      <div className="mb-6">
        <CallTimelineChart data={monthlyTimeline} />
      </div>

      {/* 6. Two-column grid: Days Early + Round Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <SectionHeader
            title="Days Early Distribution"
            subtitle="Confirmed called vs. announced events"
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <DaysEarlyChart events={events} />
        </div>
        <div>
          <SectionHeader
            title="Round Stage Breakdown"
            subtitle="Distribution by funding stage"
            icon={<PieIcon className="w-5 h-5" />}
          />
          <RoundStageDonut data={roundStageBreakdown} />
        </div>
      </div>

      {/* 7. Top Rounds by Size */}
      <SectionHeader
        title="Top Rounds by Size"
        subtitle="Largest fundraising rounds tracked"
        icon={<Trophy className="w-5 h-5" />}
      />
      <div className="mb-6">
        <TopRoundsList data={topRounds} />
      </div>

      {/* 8. Events Table */}
      <SectionHeader
        title="Events Table"
        subtitle={`${sortedEvents.length} events — click any row for details`}
        icon={<Table2 className="w-5 h-5" />}
      />
      <div className="mb-6">
        <EventsTable
          data={sortedEvents}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onRowClick={setDrawerRow}
        />
      </div>

      {/* 9. Company Intel */}
      <SectionHeader
        title="Company Intel"
        subtitle={`${companyIntel.length} companies — ARR, growth, investors, and fundraising status`}
        icon={<Building2 className="w-5 h-5" />}
      />
      <div className="mb-8">
        <CompanyIntelGrid data={companyIntel} />
      </div>

      {/* 11. Footer */}
      <Footer />

      {/* Detail Drawer */}
      <DetailDrawer row={drawerRow} onClose={() => setDrawerRow(null)} />
    </>
  );
}
