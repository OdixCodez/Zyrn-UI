import { describe, expect, it } from 'vitest';
import { escapeHtml, formatCss, truncate } from '../src/shared/utils';

describe('DevLens shared utilities', () => {
  it('formats non-empty CSS declarations as copyable CSS', () => {
    expect(formatCss({ color: 'rebeccapurple', margin: '', padding: '12px' })).toBe('color: rebeccapurple;\npadding: 12px;');
  });

  it('normalizes and truncates text previews without splitting whitespace', () => {
    expect(truncate('  DevLens\n  inspector   selection  ', 20)).toBe('DevLens inspector…');
  });

  it('escapes HTML-sensitive markup before safe text presentation', () => {
    expect(escapeHtml('<button data-test="x">&</button>')).toBe('&lt;button data-test=&quot;x&quot;&gt;&amp;&lt;/button&gt;');
  });
});
