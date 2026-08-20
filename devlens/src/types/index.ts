export type BrowserTarget = 'chrome' | 'edge' | 'firefox' | 'unknown';

export type DevLensPanel =
  | 'dashboard'
  | 'inspector'
  | 'css'
  | 'html'
  | 'playground'
  | 'components'
  | 'assets'
  | 'scripts'
  | 'analyzer'
  | 'research'
  | 'snippets'
  | 'focus'
  | 'settings';

export interface SelectedElement {
  selector: string;
  tagName: string;
  id: string | null;
  classes: string[];
  outerHTML: string;
  textPreview: string;
  hierarchy: string[];
  rect: { x: number; y: number; width: number; height: number };
  computedStyles: Record<string, string>;
  inheritedStyles: Record<string, string>;
  cssVariables: Record<string, string>;
  cssText: string;
  sourceUrl: string;
  capturedAt: string;
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  language: SnippetLanguage;
  tags: string[];
  sourceUrl?: string;
  code: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type SnippetLanguage =
  | 'html' | 'css' | 'javascript' | 'typescript' | 'react' | 'vue'
  | 'svelte' | 'python' | 'csharp' | 'java' | 'sql' | 'shell';

export interface SavedComponent {
  id: string;
  title: string;
  format: ComponentFormat;
  html: string;
  css: string;
  sourceUrl: string;
  selector: string;
  createdAt: string;
}

export type ComponentFormat = 'html-css' | 'react-jsx' | 'react-css' | 'tailwind' | 'vue' | 'svelte';

export interface UserScript {
  id: string;
  name: string;
  description: string;
  matches: string[];
  code: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FocusProfile {
  id: string;
  name: string;
  allowedDomains: string[];
  blockedDomains: string[];
  enabled: boolean;
  defaultDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  profileId: string;
  startedAt: string;
  endsAt: string;
  temporarilyAllowedDomains: string[];
}

export interface ResearchItem {
  id: string;
  type: 'webpage' | 'snippet' | 'component' | 'note' | 'reference';
  title: string;
  url?: string;
  content?: string;
  createdAt: string;
}

export interface ResearchSession {
  id: string;
  title: string;
  description: string;
  items: ResearchItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DevLensSettings {
  theme: 'dark' | 'system';
  defaultPanel: DevLensPanel;
  highlightColor: string;
  cssFormatting: 'compact' | 'expanded';
  scriptExecutionConfirm: boolean;
  onboardingComplete: boolean;
}

export interface PageAsset {
  type: 'image' | 'svg' | 'font' | 'stylesheet' | 'script';
  url: string;
  label: string;
  mimeType?: string;
}

export interface AccessibilityIssue {
  severity: 'info' | 'warning';
  message: string;
  selector: string;
}

export interface PageAnalysis {
  url: string;
  title: string;
  frameworks: string[];
  styling: string[];
  assets: PageAsset[];
  accessibility: AccessibilityIssue[];
  structure: {
    domNodes: number;
    links: number;
    buttons: number;
    forms: number;
    images: number;
    interactive: number;
  };
  analyzedAt: string;
}

export interface ExtensionError {
  operation: string;
  message: string;
  detail?: string;
}

export type DevLensMessage =
  | { type: 'SET_ACTIVE_PANEL'; panel: DevLensPanel }
  | { type: 'GET_ACTIVE_PANEL' }
  | { type: 'INSPECTOR_TOGGLE' }
  | { type: 'INSPECTOR_STOP' }
  | { type: 'GET_SELECTION' }
  | { type: 'APPLY_CSS'; selector: string; declarations: Record<string, string> }
  | { type: 'RESET_CSS' }
  | { type: 'ANALYZE_PAGE' }
  | { type: 'COLLECT_ASSETS' }
  | { type: 'RUN_USER_SCRIPT'; script: UserScript }
  | { type: 'GET_PAGE_SNAPSHOT' }
  | { type: 'FOCUS_BLOCKED'; profileId: string }
  | { type: 'FOCUS_ALLOW_TEMPORARY'; origin: string }
  | { type: 'FOCUS_END_SESSION' };

export type DevLensResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: ExtensionError };

export interface PageSnapshot {
  html: string;
  url: string;
  title: string;
}
