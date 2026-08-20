import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ZyrnAlert,
  ZyrnAlertDialog,
  ZyrnBadge,
  ZyrnButton,
  ZyrnCard,
  ZyrnCheckbox,
  ZyrnContainer,
  ZyrnContextMenu,
  ZyrnDrawer,
  ZyrnDropdown,
  ZyrnDropdownItem,
  ZyrnEmptyState,
  ZyrnGrid,
  ZyrnInline,
  ZyrnInput,
  ZyrnModal,
  ZyrnPopover,
  ZyrnProgress,
  ZyrnRadioGroup,
  ZyrnSelect,
  ZyrnSegmentedControl,
  ZyrnSkeleton,
  ZyrnStack,
  ZyrnSwitch,
  ZyrnTabs,
  ZyrnTextarea,
  ZyrnTooltip,
  ZyrnSeparator,
  ZyrnVisuallyHidden,
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
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [releaseProgress, setReleaseProgress] = useState(68);
  const [loadingReport, setLoadingReport] = useState(true);
  const [armed, setArmed] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [channel, setChannel] = useState('stable');
  const [density, setDensity] = useState('normal');
  const [systemTab, setSystemTab] = useState('runtime');
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

          <ZyrnCard titleText="Layout primitives" subText="composition / rhythm / structure" kanjiStamp="組" variant="parchment">
            <ZyrnContainer size="full" padding={0}>
              <ZyrnStack gap={4} divider>
                <ZyrnInline justify="between" gap={3}>
                  <strong className="gallery__layout-label">Stack + Inline</strong>
                  <ZyrnInline gap={2}>
                    <ZyrnBadge variant="info">Inline</ZyrnBadge>
                    <ZyrnBadge variant="success">Ready</ZyrnBadge>
                  </ZyrnInline>
                </ZyrnInline>
                <ZyrnGrid minItemWidth="8rem" gap={3}>
                  <div className="gallery__layout-cell">Auto-fit grid</div>
                  <div className="gallery__layout-cell">Responsive</div>
                  <div className="gallery__layout-cell">Token gaps</div>
                </ZyrnGrid>
                <ZyrnInline justify="between" align="center">
                  <span className="gallery__layout-note">The icon is labelled for screen readers only.</span>
                  <ZyrnTooltip content="This button has a visually hidden accessible name." placement="left">
                    <button className="gallery__signal-button" type="button" onClick={() => toast({ title: 'Signal inspected', variant: 'info' })}>
                      <span aria-hidden="true">?</span>
                      <ZyrnVisuallyHidden>Inspect system signal</ZyrnVisuallyHidden>
                    </button>
                  </ZyrnTooltip>
                </ZyrnInline>
              </ZyrnStack>
            </ZyrnContainer>
          </ZyrnCard>

          <ZyrnCard titleText="Navigation" subText="context / hierarchy / shortcuts" kanjiStamp="道">
            <div className="gallery__stack">
              <ZyrnTabs
                label="System views"
                value={systemTab}
                onValueChange={setSystemTab}
                fullWidth
                tabs={[
                  {
                    value: 'runtime',
                    label: 'Runtime',
                    content: <div className="gallery__tab-copy"><strong>Runtime nominal.</strong><span>All observable services are reporting within expected thresholds.</span></div>,
                  },
                  {
                    value: 'signals',
                    label: 'Signals',
                    content: <div className="gallery__tab-copy"><strong>Signals monitored.</strong><span>Telemetry is sampled continuously and retained for review.</span></div>,
                  },
                  {
                    value: 'archive',
                    label: 'Archive',
                    content: <div className="gallery__tab-copy"><strong>Archive sealed.</strong><span>Deployment records are available to authorized operators.</span></div>,
                  },
                ]}
              />
              <ZyrnSeparator weight="medium" />
              <div className="gallery__row">
                <ZyrnTooltip content="Hover or focus to reveal the deployment protocol." placement="bottom">
                  <ZyrnButton variant="outline" kanji="鍵">Protocol help</ZyrnButton>
                </ZyrnTooltip>
                <ZyrnTooltip content="This tooltip opens on focus too, then closes with Escape." placement="bottom">
                  <ZyrnButton variant="secondary" aria-label="Keyboard guidance">Keyboard guidance</ZyrnButton>
                </ZyrnTooltip>
              </div>
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

          <ZyrnCard titleText="Feedback states" subText="empty / progress / loading" kanjiStamp="状態" variant="parchment">
            <div className="gallery__stack">
              <ZyrnProgress
                label="Release upload"
                description="Uploading signed deployment assets."
                value={releaseProgress}
              />
              <div className="gallery__row">
                <ZyrnButton size="sm" variant="outline" onClick={() => setReleaseProgress((value) => Math.max(0, value - 10))}>Step back</ZyrnButton>
                <ZyrnButton size="sm" onClick={() => setReleaseProgress((value) => Math.min(100, value + 10))}>Advance upload</ZyrnButton>
              </div>
              <section className="gallery__loading-preview" aria-busy={loadingReport} aria-label="Deployment report preview">
                {loadingReport ? (
                  <ZyrnStack gap={2}>
                    <ZyrnSkeleton variant="text" lines={2} />
                    <ZyrnSkeleton variant="rect" height="3.5rem" animate={false} />
                  </ZyrnStack>
                ) : (
                  <p className="gallery__loading-copy"><strong>Report ready.</strong> The latest deployment passed its readiness checks.</p>
                )}
              </section>
              <ZyrnButton size="sm" variant="outline" onClick={() => setLoadingReport((loading) => !loading)}>
                {loadingReport ? 'Reveal report' : 'Show skeleton'}
              </ZyrnButton>
              <ZyrnEmptyState
                size="sm"
                stamp="空"
                title="No deployment records"
                description="Create a release to begin tracking deployment history."
                primaryAction={{ label: 'Create release', onClick: () => toast({ title: 'Release draft created', variant: 'success' }) }}
                secondaryAction={{ label: 'Read guide', onClick: () => toast({ title: 'Guide opened', variant: 'info' }) }}
              />
            </div>
          </ZyrnCard>

          <ZyrnCard titleText="Overlays" subText="focus / feedback / menus" kanjiStamp="重">
            <div className="gallery__stack">
              <div className="gallery__row">
                <ZyrnButton onClick={() => setModalOpen(true)} kanji="開">Open modal</ZyrnButton>
                <ZyrnButton onClick={() => setAlertDialogOpen(true)} variant="outline" kanji="警">Confirm purge</ZyrnButton>
                <ZyrnButton onClick={() => setDrawerOpen(true)} variant="secondary" kanji="側">Open drawer</ZyrnButton>
                <ZyrnButton
                  variant="secondary"
                  onClick={() => toast({ title: 'System armed', description: 'A toast using the ink motion system.', variant: 'success' })}
                  kanji="通知"
                >
                  Trigger toast
                </ZyrnButton>
              </div>
              {alertVisible ? (
                <ZyrnAlert
                  variant="warning"
                  title="Review required"
                  onDismiss={() => setAlertVisible(false)}
                  dismissLabel="Dismiss release review alert"
                >
                  Verify the release notes before the deployment window opens.
                </ZyrnAlert>
              ) : (
                <ZyrnButton variant="outline" onClick={() => setAlertVisible(true)} kanji="再">Restore inline alert</ZyrnButton>
              )}
              <ZyrnPopover
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
                title="Runtime annotation"
                side="bottom"
                trigger={<ZyrnButton variant="outline" kanji="注">Inspect runtime</ZyrnButton>}
              >
                <div className="gallery__overlay-copy">
                  <strong>Runtime nominal.</strong>
                  <span>Popover content stays anchored to its trigger and can be dismissed with Escape or an outside pointer interaction.</span>
                </div>
              </ZyrnPopover>
              <ZyrnContextMenu
                trigger={<ZyrnButton variant="outline" kanji="文">Right-click operations</ZyrnButton>}
                items={[
                  { label: 'Inspect signal', shortcut: 'I', onSelect: () => toast({ title: 'Signal inspected', variant: 'info' }) },
                  { label: 'Archive snapshot', shortcut: 'A', onSelect: () => toast({ title: 'Snapshot archived', variant: 'success' }) },
                  { label: 'Locked operation', disabled: true },
                ]}
              />
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

      <ZyrnAlertDialog
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        title="Purge archived records"
        description="This action cannot be undone."
        confirmLabel="Purge archive"
        onConfirm={() => toast({ title: 'Archive purged', description: 'The archived records were removed.', variant: 'danger' })}
      >
        This irreversible demonstration requires an explicit confirmation and ignores backdrop clicks.
      </ZyrnAlertDialog>

      <ZyrnDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Deployment settings"
        description="Tune the active release before it enters the queue."
        side="right"
      >
        <div className="gallery__overlay-copy">
          <strong>Release window: 18:00 UTC</strong>
          <span>The drawer is a modal side sheet with focus trapping, scroll locking, and Escape-to-close behavior.</span>
          <ZyrnButton onClick={() => { setDrawerOpen(false); toast({ title: 'Settings saved', variant: 'success' }); }} kanji="保存">Save settings</ZyrnButton>
        </div>
      </ZyrnDrawer>

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
