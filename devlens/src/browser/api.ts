import browser from 'webextension-polyfill';
import type { BrowserTarget, DevLensMessage, DevLensResponse } from '../types';

export function currentBrowser(): BrowserTarget {
  const userAgent = globalThis.navigator?.userAgent ?? '';
  if (/Edg\//.test(userAgent)) return 'edge';
  if (/Chrome\//.test(userAgent)) return 'chrome';
  if (/Firefox\//.test(userAgent)) return 'firefox';
  return 'unknown';
}

export async function getActiveTab(): Promise<browser.Tabs.Tab | undefined> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

export async function ensurePageController(tabId: number): Promise<void> {
  try {
    await browser.scripting.executeScript({ target: { tabId }, files: ['/page-controller.js'] });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Browser access to this page is unavailable.');
  }
}

export async function sendToActiveTab<T>(message: DevLensMessage): Promise<DevLensResponse<T>> {
  const tab = await getActiveTab();
  if (!tab?.id) return { ok: false, error: { operation: 'tab-message', message: 'No active browser tab is available.' } };
  try {
    await ensurePageController(tab.id);
    return await browser.tabs.sendMessage(tab.id, message) as DevLensResponse<T>;
  } catch (error) {
    return {
      ok: false,
      error: {
        operation: 'tab-message',
        message: 'DevLens cannot access this page. Activate it from a normal webpage or grant that site in Permission Center.',
        detail: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

export async function requestSiteAccess(origins: string[]): Promise<boolean> {
  return browser.permissions.request({ origins });
}

export async function getGrantedOrigins(): Promise<string[]> {
  const permissions = await browser.permissions.getAll();
  return permissions.origins ?? [];
}

export async function revokeSiteAccess(origins: string[]): Promise<boolean> {
  return browser.permissions.remove({ origins });
}

export async function openWorkspace(panel = 'dashboard'): Promise<void> {
  const tab = await getActiveTab();
  const chromeApi = (globalThis as unknown as { chrome?: { sidePanel?: { open(options: { tabId?: number }): Promise<void> } } }).chrome;
  if (chromeApi?.sidePanel && tab?.id) {
    await chromeApi.sidePanel.open({ tabId: tab.id });
    await browser.runtime.sendMessage({ type: 'SET_ACTIVE_PANEL', panel });
    return;
  }
  if (browser.sidebarAction && typeof browser.sidebarAction.open === 'function') {
    await browser.sidebarAction.open();
    await browser.runtime.sendMessage({ type: 'SET_ACTIVE_PANEL', panel });
    return;
  }
  await browser.tabs.create({ url: browser.runtime.getURL(`/sidepanel.html#${panel}`) });
}
