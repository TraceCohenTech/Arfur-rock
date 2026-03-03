export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div>
          <p>
            Built by{" "}
            <a
              href="https://x.com/Trace_Cohen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              Trace Cohen
            </a>
          </p>
          <p className="mt-1 text-slate-300">
            Data sourced from @ArfurRock Twitter intel &amp; public filings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://x.com/Trace_Cohen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            @Trace_Cohen
          </a>
          <span className="text-slate-300">&middot;</span>
          <a
            href="mailto:t@nyvp.com"
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            t@nyvp.com
          </a>
        </div>
      </div>
    </footer>
  );
}
