import Papa from "papaparse";

export interface CompanyIntel {
  company: string;
  tweetDate: string;
  focus: string;
  arr: string;
  growth: string;
  fundingRound: string;
  investors: string;
  nowRaising: boolean;
}

interface RawRow {
  Company: string;
  "Tweet Date": string;
  Focus: string;
  "ARR/Revenue": string;
  Growth: string;
  "Funding Round": string;
  Investors: string;
  "Now Raising": string;
}

export function parseCompanyIntel(csvText: string): CompanyIntel[] {
  const parsed = Papa.parse<RawRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data
    .filter((row) => row.Company && row.Company.trim())
    .map((row) => ({
      company: row.Company?.trim() || "",
      tweetDate: row["Tweet Date"]?.trim() || "",
      focus: row.Focus?.trim() || "",
      arr: row["ARR/Revenue"]?.trim() || "",
      growth: row.Growth?.trim() || "",
      fundingRound: row["Funding Round"]?.trim() || "",
      investors: row.Investors?.trim() || "",
      nowRaising:
        (row["Now Raising"]?.trim().toLowerCase() || "") === "yes" ||
        (row["Now Raising"]?.trim().toLowerCase() || "").includes("yes"),
    }));
}
