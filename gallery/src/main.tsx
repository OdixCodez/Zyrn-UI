import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ZyrnBadge,
  ZyrnButton,
  ZyrnCard,
  ZyrnCheckbox,
  ZyrnDropdown,
  ZyrnDropdownItem,
  ZyrnInput,
  ZyrnModal,
  ZyrnRadioGroup,
  ZyrnSelect,
  ZyrnSegmentedControl,
  ZyrnSwitch,
  ZyrnTextarea,
  ZyrnThemeProvider,
  ZyrnToastProvider,
  useZyrnTheme,
  useZyrnToast,
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

function GalleryContent() {
  const [submitted, setSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [armed, setArmed] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [channel, setChannel] = useState('stable');
  const [density, setDensity] = useState('normal');
  const { toast } = useZyrnToast();

  return (
    <>
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

          <ZyrnCard titleText="Selections" subText="state / keyboard / forms" kanjiStamp="選">
            <div className="gallery__form">
              <ZyrnCheckbox
                label="Arm deployment"
                kanji="準備"
                description="Confirm the release sequence can proceed."
                checked={armed}
                onChange={(event) => setArmed(event.target.checked)}
              />
              <ZyrnSwitch
                label="Telemetry stream"
                kanji="監視"
                checked={telemetry}
                onChange={(event) => setTelemetry(event.target.checked)}
              />
              <ZyrnRadioGroup
                label="Release channel"
                kanji="経路"
                value={channel}
                onValueChange={setChannel}
                options={[
                  { value: 'stable', label: 'Stable', description: 'Recommended production channel.' },
                  { value: 'edge', label: 'Edge', description: 'Early access updates.' },
                ]}
              />
              <ZyrnSegmentedControl
                label="Interface density"
                kanji="密度"
                value={density}
                onValueChange={setDensity}
                fullWidth
                options={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'spacious', label: 'Spacious' },
                ]}
              />
            </div>
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

          <ZyrnCard titleText="Overlays" subText="focus / feedback / menus" kanjiStamp="重">
            <div className="gallery__stack">
              <div className="gallery__row">
                <ZyrnButton onClick={() => setModalOpen(true)} kanji="開">Open modal</ZyrnButton>
                <ZyrnButton
                  variant="secondary"
                  onClick={() => toast({ title: 'System armed', description: 'A toast using the ink motion system.', variant: 'success' })}
                  kanji="通知"
                >
                  Trigger toast
                </ZyrnButton>
              </div>
              <ZyrnDropdown label="Operations">
                <ZyrnDropdownItem description="Keep the current draft active" onSelect={() => toast({ title: 'Draft saved', variant: 'success' })}>
                  Save draft
                </ZyrnDropdownItem>
                <ZyrnDropdownItem description="Mark this sequence for review" onSelect={() => toast({ title: 'Review flag added', variant: 'warning' })}>
                  Flag review
                </ZyrnDropdownItem>
                <ZyrnDropdownItem description="Remove the current draft" onSelect={() => toast({ title: 'Draft cleared', variant: 'danger' })}>
                  Clear draft
                </ZyrnDropdownItem>
              </ZyrnDropdown>
            </div>
          </ZyrnCard>
        </section>
      </main>

      <ZyrnModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Deploy sequence"
        description="Confirm the final payload before deployment."
      >
        <div className="gallery__modal-actions">
          <ZyrnButton variant="outline" onClick={() => setModalOpen(false)}>Cancel</ZyrnButton>
          <ZyrnButton onClick={() => { setModalOpen(false); toast({ title: 'Deployment queued', description: 'The sequence has entered the launch queue.', variant: 'success' }); }} kanji="実行">
            Confirm deploy
          </ZyrnButton>
        </div>
      </ZyrnModal>

      <footer className="gallery__footer">
        <span>zyrn-ui</span>
        <span>React + TypeScript</span>
        <span>Ink / Paper</span>
      </footer>
    </>
  );
}

function GalleryApp() {
  return (
    <ZyrnThemeProvider defaultTheme="ink" className="gallery">
      <ZyrnToastProvider>
        <GalleryContent />
      </ZyrnToastProvider>
    </ZyrnThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<GalleryApp />);
