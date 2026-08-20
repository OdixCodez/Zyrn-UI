import browser from 'webextension-polyfill';
import { defineBackground } from 'wxt/utils/define-background';
import { openWorkspace } from '../../browser/api';
import type { DevLensMessage, DevLensPanel, FocusProfile, FocusSession, UserScript } from '../../types';

const ACTIVE_PANEL_KEY = 'activePanel';
const FOCUS_SESSION_KEY = 'focusSession';

async function activeFocusSession(): Promise<FocusSession | null> {
  const values = await browser.storage.local.get(FOCUS_SESSION_KEY);
  const session = values[FOCUS_SESSION_KEY] as FocusSession | undefined;
  if (!session) return null;
  if (new Date(session.endsAt).getTime() <= Date.now()) {
    await browser.storage.local.remove(FOCUS_SESSION_KEY);
    return null;
  }
  return session;
}

async function profileFor(session: FocusSession): Promise<FocusProfile | null> {
  const values = await browser.storage.local.get('focusProfiles');
  const profiles = (values.focusProfiles ?? []) as FocusProfile[];
  return profiles.find((profile) => profile.id === session.profileId) ?? null;
}

function hostname(url: string): string | null {
  try { return new URL(url).hostname.toLowerCase(); } catch { return null; }
}

function domainMatches(host: string, pattern: string): boolean {
  const normalized = pattern.trim().toLowerCase().replace(/^\*\./, '');
  return host === normalized || host.endsWith(`.${normalized}`);
}

function shouldBlock(url: string, profile: FocusProfile, session: FocusSession): boolean {
  const host = hostname(url);
  if (!host) return false;
  if (session.temporarilyAllowedDomains.some((domain) => domainMatches(host, domain))) return false;
  if (profile.allowedDomains.some((domain) => domainMatches(host, domain))) return false;
  return profile.blockedDomains.some((domain) => domainMatches(host, domain));
}

async function enforceFocus(tabId: number, url?: string): Promise<void> {
  if (!url || url.startsWith(browser.runtime.getURL(''))) return;
  const session = await activeFocusSession();
  if (!session) return;
  const profile = await profileFor(session);
  if (!profile || !profile.enabled || !shouldBlock(url, profile, session)) return;
  const blockedUrl = browser.runtime.getURL(`/blocked.html?profile=${encodeURIComponent(profile.name)}&target=${encodeURIComponent(url)}`);
  await browser.tabs.update(tabId, { url: blockedUrl });
}

function scriptMatches(url: string, pattern: string): boolean {
  const expression = `^${pattern.replace(/[.+?^${}()|[\\]\\]/g, '\\$&').replace(/\\*/g, '.*')}$`;
  try { return new RegExp(expression, 'i').test(url); } catch { return false; }
}

async function runMatchingScripts(tabId: number, url?: string): Promise<void> {
  if (!url || url.startsWith(browser.runtime.getURL(''))) return;
  const values = await browser.storage.local.get('scripts');
  const scripts = ((values.scripts ?? []) as UserScript[]).filter((script) => script.enabled && script.matches.some((pattern) => scriptMatches(url, pattern)));
  if (!scripts.length) return;
  try {
    await browser.scripting.executeScript({ target: { tabId }, files: ['/page-controller.js'] });
    for (const script of scripts) {
      const response = await browser.tabs.sendMessage(tabId, { type: 'RUN_USER_SCRIPT', script });
      console.info('DevLens automatic script completed.', script.name, response);
    }
  } catch (error) {
    console.warn('DevLens automatic script could not run for this page.', error);
  }
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    const settings = await browser.storage.local.get('settings');
    if (!settings.settings) {
      await browser.storage.local.set({
        settings: {
          theme: 'dark',
          defaultPanel: 'dashboard',
          highlightColor: '#9B7CFF',
          cssFormatting: 'expanded',
          scriptExecutionConfirm: true,
          onboardingComplete: false,
        },
      });
    }
  });

  browser.action.onClicked.addListener(() => { void openWorkspace('dashboard'); });

  browser.commands.onCommand.addListener((command) => {
    const panels: Record<string, DevLensPanel> = {
      inspect_current_page: 'inspector',
      open_playground: 'playground',
      toggle_focus: 'focus',
    };
    const panel = panels[command];
    if (panel) void openWorkspace(panel);
  });

  browser.runtime.onMessage.addListener(async (message: unknown) => {
    const input = message as DevLensMessage;
    if (input.type === 'SET_ACTIVE_PANEL') {
      await browser.storage.local.set({ [ACTIVE_PANEL_KEY]: input.panel });
      return { ok: true };
    }
    if (input.type === 'GET_ACTIVE_PANEL') {
      const values = await browser.storage.local.get(ACTIVE_PANEL_KEY);
      return { ok: true, data: values[ACTIVE_PANEL_KEY] ?? 'dashboard' };
    }
    if (input.type === 'FOCUS_ALLOW_TEMPORARY') {
      const session = await activeFocusSession();
      if (!session) return { ok: false, error: { operation: 'focus', message: 'No active focus session is available.' } };
      const host = hostname(input.origin);
      if (!host) return { ok: false, error: { operation: 'focus', message: 'That website address is not valid.' } };
      const updated = { ...session, temporarilyAllowedDomains: [...new Set([...session.temporarilyAllowedDomains, host])] };
      await browser.storage.local.set({ [FOCUS_SESSION_KEY]: updated });
      return { ok: true, data: updated };
    }
    if (input.type === 'FOCUS_END_SESSION') {
      await browser.storage.local.remove(FOCUS_SESSION_KEY);
      await browser.alarms.clear('focus-expiry');
      return { ok: true };
    }
    return undefined;
  });

  browser.tabs.onUpdated.addListener((tabId, change) => {
    if (change.url) {
      void enforceFocus(tabId, change.url);
      void runMatchingScripts(tabId, change.url);
    }
  });

  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'focus-expiry') void activeFocusSession();
  });
});
