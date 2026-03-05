// Distinct multi-color palette for charts
export const AMBER_PALETTE = [
  '#f59e0b', // amber
  '#6366f1', // indigo
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#3b82f6', // blue
  '#f43f5e', // rose
  '#f97316', // orange
  '#06b6d4', // cyan
];

export const CHART_COLORS = {
  grid: '#f1f5f9',
  axis: '#e2e8f0',
  tick: '#64748b',
  label: '#94a3b8',
  areaFill: 'url(#amberGradient)',
  areaStroke: '#f59e0b',
};

export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    padding: '8px 12px',
    fontSize: '13px',
  },
  labelStyle: { fontWeight: 600, color: '#0f172a' },
};

export const DAYS_EARLY_BUCKETS = [
  { label: '0-7', min: 0, max: 7 },
  { label: '8-30', min: 8, max: 30 },
  { label: '31-90', min: 31, max: 90 },
  { label: '91-180', min: 91, max: 180 },
  { label: '181+', min: 181, max: Infinity },
];

export const DAYS_EARLY_COLORS = ['#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'];
