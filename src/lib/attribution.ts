// Attribution: read UTM params → localStorage.source on first visit
export function readAttribution(): string {
  if (typeof window === 'undefined') return '';
  if (localStorage.getItem('cf_source_read') === 'true') {
    return localStorage.getItem('cf_source') || '';
  }
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source') || params.get('source') || 'direct';
  const medium = params.get('utm_medium') || '';
  const combined = medium ? `${source}/${medium}` : source;
  localStorage.setItem('cf_source', combined);
  localStorage.setItem('cf_source_read', 'true');
  return combined;
}

export function getAllSources(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  const map: Record<string, number> = {};
  try {
    const raw = localStorage.getItem('cf_attribution_log') || '[]';
    const log: Array<{ source: string; ts: number }> = JSON.parse(raw);
    for (const entry of log) {
      map[entry.source] = (map[entry.source] || 0) + 1;
    }
  } catch {}
  // Always include current source
  const current = readAttribution();
  if (current) {
    map[current] = (map[current] || 0) + 1;
  }
  return map;
}

export function logAttribution(): void {
  if (typeof window === 'undefined') return;
  const source = readAttribution();
  if (!source) return;
  try {
    const raw = localStorage.getItem('cf_attribution_log') || '[]';
    const log: Array<{ source: string; ts: number }> = JSON.parse(raw);
    log.push({ source, ts: Date.now() });
    localStorage.setItem('cf_attribution_log', JSON.stringify(log.slice(-500)));
  } catch {}
}
