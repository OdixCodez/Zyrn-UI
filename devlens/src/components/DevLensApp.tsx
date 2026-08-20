import { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import { AppShell, PanelHeader } from './AppShell';
import { Onboarding } from './Onboarding';
import { localDatabase } from '../storage/database';
import type { DevLensPanel, DevLensResponse, ExtensionError, SelectedElement } from '../types';
import { CssPanel, HtmlPanel, InspectorPanel, PlaygroundPanel } from '../features/core-panels';
import { FocusPanel, SettingsPanel, SnippetVaultPanel } from '../features/local-panels';
import { AnalyzerPanel, AssetExplorerPanel, ComponentExtractorPanel, ScriptLabPanel } from '../features/advanced-panels';
import { ResearchPanel } from '../features/research-panel';

interface DashboardCounts { snippets: number; components: number; scripts: number; focusProfiles: number; }
const initialCounts: DashboardCounts = { snippets: 0, components: 0, scripts: 0, focusProfiles: 0 };

async function readCounts(): Promise<DashboardCounts> {
  const [snippets, components, scripts, focusProfiles] = await Promise.all([
    localDatabase.list('snippets'), localDatabase.list('components'), localDatabase.list('scripts'), localDatabase.list('focusProfiles'),
  ]);
  return { snippets: snippets.length, components: components.length, scripts: scripts.length, focusProfiles: focusProfiles.length };
}

export function DevLensApp({ initialPanel = 'dashboard' }: { initialPanel?: DevLensPanel }) {
  const [activePanel, setActivePanel] = useState<DevLensPanel>(initialPanel);
  const [counts, setCounts] = useState<DashboardCounts>(initialCounts);
  const [selection, setSelection] = useState<SelectedElement | null>(null);
  const [error, setError] = useState<ExtensionError | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const reportError = (operation: string, message: string, detail?: string) => setError({ operation, message, detail });
  const refreshCounts = () => void readCounts().then(setCounts).catch((cause: unknown) => reportError('dashboard', 'Unable to read some local DevLens data.', cause instanceof Error ? cause.message : String(cause)));
  const navigate = (panel: DevLensPanel) => { setActivePanel(panel); void browser.runtime.sendMessage({ type: 'SET_ACTIVE_PANEL', panel }).catch(() => undefined); };

  useEffect(() => {
    let mounted = true;
    void Promise.all([readCounts(), browser.runtime.sendMessage({ type: 'GET_ACTIVE_PANEL' }).catch(() => null)]).then(([nextCounts, response]) => {
      if (!mounted) return;
      setCounts(nextCounts);
      const typedResponse = response as DevLensResponse<DevLensPanel> | null;
      if (typedResponse?.ok && typedResponse.data) setActivePanel(typedResponse.data);
      void browser.storage.local.get('settings').then((stored) => setShowOnboarding(!(stored.settings as { onboardingComplete?: boolean } | undefined)?.onboardingComplete));
    }).catch((cause: unknown) => { if (mounted) reportError('dashboard', 'Unable to initialize the local DevLens workspace.', cause instanceof Error ? cause.message : String(cause)); });
    return () => { mounted = false; };
  }, []);

  let content: React.ReactNode = <Dashboard counts={counts} onNavigate={navigate} />;
  const pageProps = { selection, onSelection: setSelection, reportError };
  switch (activePanel) {
    case 'inspector': content = <InspectorPanel {...pageProps} />; break;
    case 'css': content = <CssPanel {...pageProps} />; break;
    case 'html': content = <HtmlPanel {...pageProps} />; break;
    case 'playground': content = <PlaygroundPanel {...pageProps} />; break;
    case 'components': content = <ComponentExtractorPanel selection={selection} reportError={reportError} />; break;
    case 'assets': content = <AssetExplorerPanel reportError={reportError} />; break;
    case 'scripts': content = <ScriptLabPanel reportError={reportError} />; break;
    case 'analyzer': content = <AnalyzerPanel reportError={reportError} />; break;
    case 'research': content = <ResearchPanel reportError={reportError} />; break;
    case 'snippets': content = <SnippetVaultPanel reportError={reportError} />; break;
    case 'focus': content = <FocusPanel reportError={reportError} />; break;
    case 'settings': content = <SettingsPanel reportError={reportError} />; break;
    case 'dashboard': break;
  }

  const finishOnboarding = (openFocus: boolean) => {
    void browser.storage.local.get('settings').then((stored) => browser.storage.local.set({ settings: { ...(stored.settings as object | undefined), onboardingComplete: true } })).catch((cause: unknown) => reportError('onboarding', 'DevLens could not save onboarding preference.', cause instanceof Error ? cause.message : String(cause)));
    setShowOnboarding(false);
    if (openFocus) navigate('focus');
  };

  return <><AppShell activePanel={activePanel} onPanelChange={navigate} error={error} onDismissError={() => setError(null)}>{content}</AppShell>{showOnboarding && <Onboarding onComplete={finishOnboarding} />}</>;
}

function Dashboard({ counts, onNavigate }: { counts: DashboardCounts; onNavigate: (panel: DevLensPanel) => void }) {
  return <section>
    <PanelHeader eyebrow="DEVLENS / LOCAL WORKSPACE" title="Good evening." description="Inspect, extract, experiment, research, and focus — without sending your browsing data anywhere by default." />
    <div className="card-grid"><Metric label="Saved snippets" value={counts.snippets} detail="Stored locally in this browser" /><Metric label="Components" value={counts.components} detail="Extracted from visible page resources" /><Metric label="Scripts" value={counts.scripts} detail="User-managed and locally stored" /><Metric label="Focus profiles" value={counts.focusProfiles} detail="Voluntary, configurable profiles" /></div>
    <div className="section-heading"><h2>Quick actions</h2><p>Keyboard shortcuts are configurable in your browser’s extension settings.</p></div>
    <div className="card-grid"><button className="card action-card" type="button" onClick={() => onNavigate('inspector')}><h3>Inspect page</h3><p>Pick a live DOM element, view computed CSS, and copy browser-visible markup.</p></button><button className="card action-card" type="button" onClick={() => onNavigate('playground')}><h3>Open playground</h3><p>Run an isolated local preview for HTML, CSS, and JavaScript experiments.</p></button><button className="card action-card" type="button" onClick={() => onNavigate('components')}><h3>Extract component</h3><p>Prepare a reusable local component from an inspected browser-visible element.</p></button><button className="card action-card" type="button" onClick={() => onNavigate('analyzer')}><h3>Analyze page</h3><p>Review page structure, exposed assets, framework signals, and basic accessibility checks.</p></button></div>
    <section className="notice" style={{ marginTop: 20 }}><strong>Privacy default:</strong> DevLens is local-first. It stores workspace data in this browser and does not include analytics, history collection, or automatic external transmission.</section>
  </section>;
}


function Metric({ label, value, detail }: { label: string; value: number; detail: string }) { return <section className="metric-card"><p className="metric-label">{label}</p><p className="metric-value">{value}</p><p className="metric-detail">{detail}</p></section>; }
