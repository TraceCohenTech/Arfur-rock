export interface Tweet {
  date: string;
  text: string;
  quotedUser?: string;
  quotedHandle?: string;
  quotedDate?: string;
  quotedText?: string;
}

/**
 * Parse raw unstructured ArfurRock tweet dump into structured tweets.
 * Each tweet block starts with "Arfur Rock\n@ArfurRock\n·\n<date>"
 */
export function parseTweets(raw: string): Tweet[] {
  const tweets: Tweet[] = [];

  // Split into tweet blocks by the "Arfur Rock\n@ArfurRock\n·\n" delimiter
  const delimiter = /Arfur Rock\n@ArfurRock\n·\n/g;
  const parts = raw.split(delimiter);

  // First part might be a standalone tweet or noise before the first delimiter
  // Skip it if it doesn't contain useful content, otherwise it's part of a quoted tweet

  for (let i = 1; i < parts.length; i++) {
    const block = parts[i].trim();
    if (!block) continue;

    const lines = block.split('\n');
    if (lines.length === 0) continue;

    // First line is the date
    const dateLine = lines[0].trim();

    // Find where "Quote" section starts (if any)
    const quoteIdx = lines.findIndex(
      (l, idx) => idx > 0 && l.trim() === 'Quote'
    );

    // Extract tweet text (between date and Quote marker, or to end)
    const textEnd = quoteIdx > 0 ? quoteIdx : lines.length;
    const textLines = lines.slice(1, textEnd).filter((l) => {
      const trimmed = l.trim();
      // Filter out noise lines
      if (!trimmed) return false;
      if (/^\d+:\d+ \/ \d+:\d+$/.test(trimmed)) return false; // video timestamps
      if (trimmed === 'Show more') return false;
      return true;
    });

    const text = textLines.join(' ').trim();
    if (!text) continue;

    // Skip non-intel tweets (job postings, meta-commentary without substance)
    if (text.length < 15) continue;

    const tweet: Tweet = {
      date: normalizeDate(dateLine),
      text,
    };

    // Parse quoted section
    if (quoteIdx > 0 && quoteIdx < lines.length - 1) {
      const quoteLines = lines.slice(quoteIdx + 1);
      const parsed = parseQuotedSection(quoteLines);
      if (parsed) {
        tweet.quotedUser = parsed.user;
        tweet.quotedHandle = parsed.handle;
        tweet.quotedDate = parsed.date;
        tweet.quotedText = parsed.text;
      }
    }

    tweets.push(tweet);
  }

  return tweets;
}

function normalizeDate(raw: string): string {
  const trimmed = raw.trim();
  // Handle relative times like "17h", "2d"
  if (/^\d+[hmd]$/.test(trimmed)) return trimmed;
  // Handle dates like "Feb 27", "Jan 8", "Dec 15, 2025"
  return trimmed;
}

function parseQuotedSection(
  lines: string[]
): { user: string; handle: string; date: string; text: string } | null {
  if (lines.length < 2) return null;

  let user = '';
  let handle = '';
  let date = '';
  const textLines: string[] = [];
  let phase: 'user' | 'date' | 'text' = 'user';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (phase === 'user') {
      if (trimmed.startsWith('@')) {
        handle = trimmed;
        phase = 'date';
      } else if (trimmed !== '·') {
        user = trimmed;
      }
      continue;
    }

    if (phase === 'date') {
      if (trimmed === '·') continue;
      // Check if this looks like a date
      if (
        /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s/i.test(trimmed) ||
        /^\d+[hmd]$/.test(trimmed)
      ) {
        date = trimmed;
        phase = 'text';
        continue;
      }
      // Might be the text already
      textLines.push(trimmed);
      phase = 'text';
      continue;
    }

    if (phase === 'text') {
      // Filter noise
      if (/^\d+:\d+ \/ \d+:\d+$/.test(trimmed)) continue;
      if (trimmed === 'Show more') continue;
      textLines.push(trimmed);
    }
  }

  const text = textLines
    .filter((l) => {
      const t = l.trim();
      if (!t) return false;
      if (t.startsWith('http://') || t.startsWith('https://')) return false;
      return true;
    })
    .join(' ')
    .trim();

  if (!user && !text) return null;

  return { user, handle, date, text };
}
