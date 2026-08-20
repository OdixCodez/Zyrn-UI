import type { ReactNode } from 'react';
import type { DevLensPanel, ExtensionError } from '../types';

const navigation: Array<{ id: DevLensPanel; label: string; glyph: string }> = [
  { id: 'dashboard', label: 'Dashboard', glyph: '◈' },
  { id: 'inspector', label: 'Inspector', glyph: '⌖' },
  { id: 'css', label: 'CSS Lab', glyph: '⌘' },
  { id: 'html', label: 'HTML', glyph: '</>' },
  { id: 'playground', label: 'Playground', glyph: '▣' },
  { id: 'components', label: 'Components', glyph: '◫' },
  { id: 'assets', label: 'Assets', glyph: '◌' },
  { id: 'scripts', label: 'Scripts', glyph: 'ƒ' },
  { id: 'analyzer', label: 'Analyzer', glyph: '◍' },
  { id: 'research', label: 'Research', glyph: '◒' },
  { id: 'snippets', label: 'Snippets', glyph: '{ }' },
  { id: 'focus', label: 'Focus', glyph: '◴' },
  { id: 'settings', label: 'Settings', glyph: '⚙' },
];

interface AppShellProps {
  activePanel: DevLensPanel;
  onPanelChange: (panel: DevLensPanel) => void;
  children: ReactNode;
  error?: ExtensionError | null;
  onDismissError: () => void;
}

export function AppShell({ activePanel, onPanelChange, children, error, onDismissError }: AppShellProps) {
  return (
    <div className="devlens-shell">
      <aside className="devlens-nav" aria-label="DevLens workspace navigation">
        <div className="brand-lockup" aria-label="DevLens">
          <div className="brand-mark" aria-hidden="true"><span>&lt;</span><i /> <span>/&gt;</span></div>
          <div><strong>DEVLENS</strong><small>LOCAL WORKSPACE</small></div>
        </div>
        <nav>
          {navigation.map((item) => (
            <button
              className={activePanel === item.id ? 'nav-item active' : 'nav-item'}
              type="button"
              key={item.id}
              aria-current={activePanel === item.id ? 'page' : undefined}
              onClick={() => onPanelChange(item.id)}
            >
              <span aria-hidden="true">{item.glyph}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="nav-footer"><span className="status-dot" /> LOCAL FIRST</div>
      </aside>
      <main className="devlens-main">
        {children}
      </main>
      {error && (
        <section className="error-toast" role="alert">
          <div><strong>{error.operation}</strong><p>{error.message}</p>{error.detail && <details><summary>Technical details</summary><code>{error.detail}</code></details>}</div>
          <button type="button" className="icon-button" aria-label="Dismiss error" onClick={onDismissError}>×</button>
        </section>
      )}
    </div>
  );
}

export function PanelHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <header className="panel-header">
    <div><p className="eyebrow">{eyebrow ?? 'DEVLENS'}</p><h1>{title}</h1><p className="panel-description">{description}</p></div>
    {actions && <div className="panel-actions">{actions}</div>}
  </header>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <section className="empty-state"><div className="empty-mark" aria-hidden="true">◇</div><h2>{title}</h2><p>{description}</p>{action}</section>;
}
