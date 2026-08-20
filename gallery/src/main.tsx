import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ZyrnBadge,
  ZyrnButton,
  ZyrnCard,
  ZyrnInput,
  ZyrnSelect,
  ZyrnTextarea,
  ZyrnThemeProvider,
  useZyrnTheme,
} from 'zyrn-ui';
import '../../src/theme/index.css';
import './gallery.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useZyrnTheme();

  return (
    <ZyrnButton variant="outline" size="sm" onClick={toggleTheme} aria-label={`Switch from ${theme} theme`}>
      {theme === 'ink' ? 'Paper mode' : 'Ink mode'}
    </ZyrnButton>
  );
}

function GalleryApp() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <ZyrnThemeProvider defaultTheme="ink" className="gallery">
      <header className="gallery__header">
        <div>
          <p className="gallery__eyebrow">Zyrn-UI / Component gallery</p>
          <h1>Clean structure. Dirty edges.</h1>
          <p className="gallery__lede">A live reference for the component system, tokens, states, and accessible form contracts.</p>
        </div>
        <ThemeToggle />
      </header>

      <main className="gallery__main">
        <section className="gallery__hero" aria-labelledby="hero-title">
          <div>
            <p className="gallery__kicker">First slice / 2026</p>
            <h2 id="hero-title">Primitives with a point of view.</h2>
            <p>Every surface is built from the same ink, paper, focus, type, and hard-shadow tokens.</p>
          </div>
          <div className="gallery__badge-cluster" aria-label="Component status">
            <ZyrnBadge variant="success" kanji="稼働" dot>Ready</ZyrnBadge>
            <ZyrnBadge variant="warning" kanji="注意" dot>Review</ZyrnBadge>
            <ZyrnBadge variant="danger" kanji="危険" dot>Critical</ZyrnBadge>
          </div>
        </section>

        <section className="gallery__grid" aria-label="Component examples">
          <ZyrnCard titleText="Buttons" subText="action / motion" kanjiStamp="打">
            <div className="gallery__stack">
              <div className="gallery__row">
                <ZyrnButton>Primary</ZyrnButton>
                <ZyrnButton variant="secondary">Secondary</ZyrnButton>
                <ZyrnButton variant="outline">Outline</ZyrnButton>
              </div>
              <div className="gallery__row">
                <ZyrnButton size="sm" kanji="小">Small</ZyrnButton>
                <ZyrnButton size="lg" kanji="大">Large</ZyrnButton>
              </div>
            </div>
          </ZyrnCard>

          <ZyrnCard titleText="Form controls" subText="label / error / native" kanjiStamp="入力" variant="parchment">
            <form className="gallery__form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <ZyrnInput label="Operator" kanji="操作者" placeholder="Enter a name" />
              <ZyrnTextarea label="Brief" kanji="概要" placeholder="Describe the task" description="Keep it concise." fullWidth />
              <ZyrnSelect label="Priority" kanji="優先" defaultValue="normal" fullWidth>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </ZyrnSelect>
              <ZyrnButton type="submit" kanji="実行">Execute</ZyrnButton>
              {submitted && <ZyrnBadge variant="success" role="status">Submitted</ZyrnBadge>}
            </form>
          </ZyrnCard>

          <ZyrnCard titleText="Badges" subText="status / semantic" kanjiStamp="印" variant="vermilion">
            <div className="gallery__badge-grid">
              <ZyrnBadge size="sm">Default</ZyrnBadge>
              <ZyrnBadge variant="info" size="md" kanji="情報">Info</ZyrnBadge>
              <ZyrnBadge variant="success" size="lg" dot>Success</ZyrnBadge>
              <ZyrnBadge variant="warning" dot>Warning</ZyrnBadge>
              <ZyrnBadge variant="danger" dot>Danger</ZyrnBadge>
            </div>
          </ZyrnCard>
        </section>
      </main>

      <footer className="gallery__footer">
        <span>zyrn-ui</span>
        <span>React + TypeScript</span>
        <span>Ink / Paper</span>
      </footer>
    </ZyrnThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<GalleryApp />);
