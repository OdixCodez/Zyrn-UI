export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function now(): string {
  return new Date().toISOString();
}

export function truncate(value: string, length = 140): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= length) return normalized;
  const candidate = normalized.slice(0, length - 1);
  const boundary = candidate.lastIndexOf(' ');
  const preview = boundary > 0 ? candidate.slice(0, boundary) : candidate;
  return `${preview}…`;
}

export function formatCss(declarations: Record<string, string>): string {
  return Object.entries(declarations)
    .filter(([, value]) => value.trim().length > 0)
    .map(([property, value]) => `${property}: ${value};`)
    .join('\n');
}

export async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function downloadJson(filename: string, value: unknown): void {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character);
}
