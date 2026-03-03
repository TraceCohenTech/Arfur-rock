"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Tweet } from "@/lib/parseTweets";
import { MessageCircle, Quote, ChevronDown } from "lucide-react";

interface Props {
  tweets: Tweet[];
}

const INITIAL_COUNT = 10;
const LOAD_MORE = 10;

export default function TweetsFeed({ tweets }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visible = tweets.slice(0, visibleCount);
  const hasMore = visibleCount < tweets.length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-static overflow-hidden"
    >
      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

      <div className="divide-y divide-slate-100">
        {visible.map((tweet, i) => (
          <TweetCard key={i} tweet={tweet} index={i} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="p-4 text-center border-t border-slate-100">
          <button
            onClick={() => setVisibleCount((c) => c + LOAD_MORE)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-full transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            Show More ({tweets.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </motion.div>
  );
}

function TweetCard({ tweet, index }: { tweet: Tweet; index: number }) {
  // Detect if this tweet mentions a dollar amount (funding intel)
  const hasMoney = /\$[\d.]+[BMKbmk]?\b/.test(tweet.text);
  const isConfirmation =
    tweet.text.toLowerCase().includes("confirm") ||
    tweet.text.toLowerCase().includes("early here");
  const isRumor =
    tweet.text.toLowerCase().includes("hearing") ||
    tweet.text.toLowerCase().includes("rumor");

  let accentColor = "border-l-slate-200";
  if (isConfirmation) accentColor = "border-l-emerald-400";
  else if (hasMoney) accentColor = "border-l-amber-400";
  else if (isRumor) accentColor = "border-l-violet-400";

  // Extract company mentions and dollar amounts for highlighting
  const highlightedText = highlightIntel(tweet.text);

  return (
    <div
      className={`px-5 py-4 border-l-4 ${accentColor} hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-transparent transition-all`}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
          <MessageCircle className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-bold text-slate-900">@ArfurRock</span>
        <span className="text-xs text-slate-400">{tweet.date}</span>

        {/* Intel badges */}
        <div className="flex gap-1.5 ml-auto">
          {isConfirmation && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-emerald-100 text-emerald-700">
              Confirmed
            </span>
          )}
          {isRumor && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-violet-100 text-violet-700">
              Rumor
            </span>
          )}
          {hasMoney && !isConfirmation && !isRumor && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-amber-100 text-amber-700">
              Intel
            </span>
          )}
        </div>
      </div>

      {/* Tweet text */}
      <p
        className="text-sm text-slate-700 leading-relaxed mb-2"
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />

      {/* Quoted tweet */}
      {tweet.quotedUser && tweet.quotedText && (
        <div className="ml-4 mt-2 p-3 rounded-xl bg-slate-50/80 ring-1 ring-slate-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Quote className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">
              {tweet.quotedUser}
            </span>
            {tweet.quotedHandle && (
              <span className="text-xs text-slate-400">
                {tweet.quotedHandle}
              </span>
            )}
            {tweet.quotedDate && (
              <span className="text-[10px] text-slate-300 ml-auto">
                {tweet.quotedDate}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
            {tweet.quotedText}
          </p>
        </div>
      )}
    </div>
  );
}

function highlightIntel(text: string): string {
  // Highlight dollar amounts
  let result = text.replace(
    /(\$[\d,.]+\s*[BMKbmk](?:illion)?)/gi,
    '<span class="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">$1</span>'
  );
  // Highlight standalone dollar amounts like $50B, $10B
  result = result.replace(
    /(\$[\d,.]+[BMK])\b/gi,
    '<span class="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">$1</span>'
  );
  // Highlight valuation mentions
  result = result.replace(
    /(\$[\d,.]+\s*(?:valuation|post|pre))/gi,
    '<span class="font-bold text-amber-700">$1</span>'
  );
  // Highlight ARR/RR mentions
  result = result.replace(
    /([\d,.]+[BMK]?\s*(?:ARR|RR)\b)/gi,
    '<span class="font-semibold text-blue-700">$1</span>'
  );
  // Highlight growth metrics
  result = result.replace(
    /(\d+[x×]\s*(?:YoY|MoM|growth)?)/gi,
    '<span class="font-semibold text-purple-700">$1</span>'
  );

  return result;
}
