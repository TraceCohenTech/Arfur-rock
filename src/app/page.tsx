import fs from "fs";
import path from "path";
import { parseCSVData } from "@/lib/parseData";
import { parseTweets } from "@/lib/parseTweets";
import { parseCompanyIntel } from "@/lib/parseCompanyIntel";
import Dashboard from "@/components/Dashboard";

// Data paths
const CSV_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "arfurrock_dashboard_master_v5.csv"
);

const TWEETS_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "arfur_tweets.txt"
);

const INTEL_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "arfurrock_company_intel.csv"
);

export default function Page() {
  const csvText = fs.readFileSync(CSV_PATH, "utf-8");
  const { events, summaries } = parseCSVData(csvText);

  const tweetsText = fs.readFileSync(TWEETS_PATH, "utf-8");
  const tweets = parseTweets(tweetsText);

  const intelText = fs.readFileSync(INTEL_PATH, "utf-8");
  const companyIntel = parseCompanyIntel(intelText);

  // Serialize dates for client transport
  const serializedEvents = events.map((e) => ({
    ...e,
    call_date: e.call_date ? e.call_date.toISOString() : null,
    official_announce_date: e.official_announce_date
      ? e.official_announce_date.toISOString()
      : null,
  }));

  const serializedSummaries = summaries.map((s) => ({
    ...s,
    call_date: s.call_date ? s.call_date.toISOString() : null,
  }));

  return (
    <main className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        <Dashboard
          rawEvents={serializedEvents}
          rawSummaries={serializedSummaries}
          tweets={tweets}
          companyIntel={companyIntel}
        />
      </div>
    </main>
  );
}
