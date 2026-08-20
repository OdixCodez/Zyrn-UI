/* This function is intentionally self-contained because browser.scripting executes its source in an isolated extension world. */
export function installPageController() {
  const controllerKey = '__DEVLENS_PAGE_CONTROLLER__';
  if ((window as Window & { [controllerKey]?: boolean })[controllerKey]) return;
  (window as Window & { [controllerKey]?: boolean })[controllerKey] = true;

  type Selection = {
    selector: string; tagName: string; id: string | null; classes: string[]; outerHTML: string; textPreview: string;
    hierarchy: string[]; rect: { x: number; y: number; width: number; height: number }; computedStyles: Record<string, string>;
    inheritedStyles: Record<string, string>; cssVariables: Record<string, string>; cssText: string; sourceUrl: string; capturedAt: string;
  };

  let inspectedElement: Element | null = null;
  let hoveredElement: Element | null = null;
  let inspectorActive = false;
  let overlay: HTMLDivElement | null = null;
  const appliedStyles = new Map<HTMLElement, Map<string, { value: string; priority: string }>>();

  const api = (globalThis as unknown as { browser?: any; chrome?: any }).browser ?? (globalThis as unknown as { chrome?: any }).chrome;
  const respond = (ok: boolean, data?: unknown, error?: { operation: string; message: string; detail?: string }) => ({ ok, ...(ok ? { data } : { error }) });

  function cssEscape(value: string) {
    if ('CSS' in window && typeof CSS.escape === 'function') return CSS.escape(value);
    return value.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`);
  }

  function selectorFor(element: Element): string {
    if (element.id && document.querySelectorAll(`#${cssEscape(element.id)}`).length === 1) return `#${cssEscape(element.id)}`;
    const path: string[] = [];
    let current: Element | null = element;
    while (current && current.nodeType === Node.ELEMENT_NODE && path.length < 7) {
      const tag = current.tagName.toLowerCase();
      const stableClasses = [...current.classList].filter((name) => !/^(css-|sc-|jsx-|ng-)/.test(name)).slice(0, 2);
      let segment = tag + stableClasses.map((name) => `.${cssEscape(name)}`).join('');
      const siblings = current.parentElement ? [...current.parentElement.children].filter((child) => child.tagName === current!.tagName) : [];
      if (siblings.length > 1) segment += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      path.unshift(segment);
      const candidate = path.join(' > ');
      if (document.querySelectorAll(candidate).length === 1) return candidate;
      current = current.parentElement;
    }
    return path.join(' > ');
  }

  function ensureOverlay() {
    if (overlay?.isConnected) return overlay;
    overlay = document.createElement('div');
    overlay.setAttribute('data-devlens-overlay', 'true');
    Object.assign(overlay.style, { position: 'fixed', zIndex: '2147483647', pointerEvents: 'none', display: 'none', border: '2px solid #9b7cff', background: 'rgba(155,124,255,.14)', borderRadius: '3px', boxShadow: '0 0 0 1px rgba(5,5,10,.6)' });
    document.documentElement.append(overlay);
    return overlay;
  }

  function positionOverlay(element: Element | null) {
    const nextOverlay = ensureOverlay();
    if (!element) { nextOverlay.style.display = 'none'; return; }
    const box = element.getBoundingClientRect();
    Object.assign(nextOverlay.style, { display: 'block', top: `${box.top}px`, left: `${box.left}px`, width: `${box.width}px`, height: `${box.height}px` });
  }

  function onMove(event: MouseEvent) {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    if (!element || element === overlay || overlay?.contains(element)) return;
    hoveredElement = element;
    positionOverlay(element);
  }

  function onClick(event: MouseEvent) {
    if (!inspectorActive || !hoveredElement) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    inspectedElement = hoveredElement;
    inspectorActive = false;
    document.removeEventListener('mousemove', onMove, true);
    document.removeEventListener('click', onClick, true);
    positionOverlay(inspectedElement);
  }

  function startInspector() {
    inspectorActive = true;
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
  }

  function stopInspector() {
    inspectorActive = false;
    document.removeEventListener('mousemove', onMove, true);
    document.removeEventListener('click', onClick, true);
    positionOverlay(inspectedElement);
  }

  function formatValue(value: string) { return value || 'initial'; }

  function selectedStyles(element: Element): Selection {
    const computed = getComputedStyle(element);
    const parentComputed = element.parentElement ? getComputedStyle(element.parentElement) : null;
    const styleKeys = ['display', 'position', 'box-sizing', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border', 'border-radius', 'box-shadow', 'color', 'background', 'background-color', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align', 'text-transform', 'opacity', 'overflow', 'overflow-x', 'overflow-y', 'z-index', 'flex', 'flex-direction', 'justify-content', 'align-items', 'gap', 'grid-template-columns', 'grid-template-rows', 'transform', 'transition', 'animation', 'filter'];
    const inheritedKeys = ['color', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align', 'text-transform', 'visibility', 'cursor'];
    const computedStyles = Object.fromEntries(styleKeys.map((key) => [key, formatValue(computed.getPropertyValue(key).trim())]));
    const inheritedStyles = Object.fromEntries(inheritedKeys.filter((key) => parentComputed && computed.getPropertyValue(key) === parentComputed.getPropertyValue(key)).map((key) => [key, formatValue(computed.getPropertyValue(key).trim())]));
    const cssVariables: Record<string, string> = {};
    for (const property of computed) if (property.startsWith('--')) cssVariables[property] = computed.getPropertyValue(property).trim();
    const selector = selectorFor(element);
    const cssRules: string[] = [];
    for (const sheet of [...document.styleSheets]) {
      try {
        for (const rule of [...sheet.cssRules]) {
          const cssRule = rule as CSSStyleRule;
          if (cssRule.selectorText && [...document.querySelectorAll(cssRule.selectorText)].includes(element)) cssRules.push(cssRule.cssText);
        }
      } catch { /* Cross-origin stylesheet rules are intentionally not accessible. */ }
    }
    const rect = element.getBoundingClientRect();
    return {
      selector, tagName: element.tagName.toLowerCase(), id: element.id || null, classes: [...element.classList], outerHTML: element.outerHTML,
      textPreview: (element.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 240), hierarchy: (() => { const values: string[] = []; let current: Element | null = element; while (current && values.length < 8) { values.unshift(current.tagName.toLowerCase() + (current.id ? `#${current.id}` : '')); current = current.parentElement; } return values; })(),
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }, computedStyles, inheritedStyles, cssVariables,
      cssText: [...cssRules, element.getAttribute('style') ? `${selector} { ${element.getAttribute('style')} }` : ''].filter(Boolean).join('\n\n'), sourceUrl: location.href, capturedAt: new Date().toISOString(),
    };
  }

  function applyCss(selector: string, declarations: Record<string, string>) {
    const element = document.querySelector(selector);
    if (!(element instanceof HTMLElement)) throw new Error('The selected element is no longer available on this page.');
    let originals = appliedStyles.get(element);
    if (!originals) { originals = new Map(); appliedStyles.set(element, originals); }
    for (const [property, value] of Object.entries(declarations)) {
      if (!originals.has(property)) originals.set(property, { value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property) });
      if (value.trim()) element.style.setProperty(property, value.trim(), 'important');
      else element.style.removeProperty(property);
    }
    return selectedStyles(element);
  }

  function resetCss() {
    for (const [element, originals] of appliedStyles) {
      for (const [property, original] of originals) {
        if (original.value) element.style.setProperty(property, original.value, original.priority);
        else element.style.removeProperty(property);
      }
    }
    appliedStyles.clear();
    return inspectedElement ? selectedStyles(inspectedElement) : null;
  }

  function collectAssets() {
    const fromElements = [
      ...[...document.images].map((image) => ({ type: 'image', url: image.currentSrc || image.src, label: image.alt || image.getAttribute('aria-label') || image.src.split('/').pop() || 'Image' })),
      ...[...document.querySelectorAll('svg')].map((svg, index) => ({ type: 'svg', url: `inline-svg:${index + 1}`, label: svg.getAttribute('aria-label') || `Inline SVG ${index + 1}` })),
      ...[...document.querySelectorAll('link[rel~="stylesheet"]')].map((link) => ({ type: 'stylesheet', url: (link as HTMLLinkElement).href, label: (link as HTMLLinkElement).href.split('/').pop() || 'Stylesheet' })),
      ...[...document.scripts].filter((script) => script.src).map((script) => ({ type: 'script', url: script.src, label: script.src.split('/').pop() || 'Script' })),
      ...[...document.fonts].map((font) => ({ type: 'font', url: `font:${font.family}`, label: font.family })),
    ];
    const seen = new Set<string>();
    return fromElements.filter((item) => item.url && !seen.has(item.url) && (seen.add(item.url) || true));
  }

  function analyzePage() {
    const html = document.documentElement.outerHTML.toLowerCase();
    const scripts = [...document.scripts].map((script) => `${script.src} ${script.textContent ?? ''}`).join(' ').toLowerCase();
    const has = (...needles: string[]) => needles.some((needle) => html.includes(needle) || scripts.includes(needle));
    const frameworks = [has('react', '__next') && 'React/Next.js', has('vue', '__nuxt') && 'Vue/Nuxt', has('ng-version', 'angular') && 'Angular', has('svelte') && 'Svelte', has('astro') && 'Astro', has('wp-content', 'wordpress') && 'WordPress'].filter(Boolean);
    const styling = [has('tailwind') && 'Tailwind', has('bootstrap') && 'Bootstrap', has('styled-components') && 'styled-components', has('css module', '__webpack') && 'CSS Modules', has('.scss', '.sass') && 'Sass', 'CSS'].filter(Boolean);
    const accessibility: Array<{ severity: string; message: string; selector: string }> = [];
    for (const image of [...document.images].filter((image) => !image.hasAttribute('alt')).slice(0, 50)) accessibility.push({ severity: 'warning', message: 'Image has no alt attribute.', selector: selectorFor(image) });
    for (const input of [...document.querySelectorAll('input, select, textarea')].filter((field) => !field.getAttribute('aria-label') && !field.getAttribute('aria-labelledby') && !field.id || (field.id && !document.querySelector(`label[for="${cssEscape(field.id)}"]`))).slice(0, 50)) accessibility.push({ severity: 'warning', message: 'Form control may not have an accessible label.', selector: selectorFor(input) });
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((heading) => Number(heading.tagName.slice(1)));
    if (headings.some((heading, index) => index > 0 && heading > headings[index - 1]! + 1)) accessibility.push({ severity: 'info', message: 'Heading levels skip one or more levels.', selector: 'heading structure' });
    const nodes = document.querySelectorAll('*');
    return { url: location.href, title: document.title, frameworks, styling, assets: collectAssets(), accessibility, structure: { domNodes: nodes.length, links: document.links.length, buttons: document.querySelectorAll('button').length, forms: document.forms.length, images: document.images.length, interactive: document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])').length }, analyzedAt: new Date().toISOString() };
  }

  async function runScript(script: { code: string; name: string }) {
    const logs: string[] = [];
    const devlens = Object.freeze({
      selection: inspectedElement ? selectedStyles(inspectedElement) : null,
      log: (...values: unknown[]) => logs.push(values.map((value) => typeof value === 'string' ? value : JSON.stringify(value)).join(' ')),
      query: (selector: string) => document.querySelector(selector),
      queryAll: (selector: string) => [...document.querySelectorAll(selector)],
    });
    try {
      // User-authored scripts run in this extension's isolated content-script world, not in the page's main JavaScript world.
      Function('devlens', `'use strict';\n${script.code}`)(devlens);
      return { logs };
    } catch (error) {
      throw new Error(`Script execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  api.runtime.onMessage.addListener((message: any, _sender: unknown, sendResponse: (value: unknown) => void) => {
    Promise.resolve().then(async () => {
      if (message.type === 'INSPECTOR_TOGGLE') { startInspector(); return respond(true, { active: true }); }
      if (message.type === 'INSPECTOR_STOP') { stopInspector(); return respond(true, { active: false }); }
      if (message.type === 'GET_SELECTION') return inspectedElement ? respond(true, selectedStyles(inspectedElement)) : respond(false, undefined, { operation: 'inspector', message: 'No element is selected. Activate Inspector and click an element on the page.' });
      if (message.type === 'APPLY_CSS') return respond(true, applyCss(message.selector, message.declarations));
      if (message.type === 'RESET_CSS') return respond(true, resetCss());
      if (message.type === 'GET_PAGE_SNAPSHOT') return respond(true, { html: document.documentElement.outerHTML, url: location.href, title: document.title });
      if (message.type === 'COLLECT_ASSETS') return respond(true, collectAssets());
      if (message.type === 'ANALYZE_PAGE') return respond(true, analyzePage());
      if (message.type === 'RUN_USER_SCRIPT') return respond(true, await runScript(message.script));
      return respond(false, undefined, { operation: 'message', message: 'DevLens does not recognize this page request.' });
    }).then(sendResponse).catch((error) => sendResponse(respond(false, undefined, { operation: 'page-controller', message: 'DevLens could not complete this page operation.', detail: error instanceof Error ? error.message : String(error) })));
    return true;
  });
}
