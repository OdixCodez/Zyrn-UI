import browser from 'webextension-polyfill';
import type { DevLensResponse, FocusSession } from '../../types';

const parameters = new URLSearchParams(location.search);
const target = parameters.get('target') ?? '';
const profile = parameters.get('profile') ?? 'your active profile';
const targetElement = document.getElementById('target')!;
const message = document.getElementById('message')!;

targetElement.textContent = target ? new URL(target).hostname : 'Blocked website';
message.textContent = `Focus Mode is active through ${profile}. This website is paused until you choose otherwise.`;

document.getElementById('allow')!.addEventListener('click', async () => {
  const response = await browser.runtime.sendMessage({ type: 'FOCUS_ALLOW_TEMPORARY', origin: target }) as DevLensResponse<FocusSession>;
  if (response.ok) location.assign(target);
  else message.textContent = response.error.message;
});

document.getElementById('end')!.addEventListener('click', async () => {
  await browser.runtime.sendMessage({ type: 'FOCUS_END_SESSION' });
  location.assign(target || 'about:blank');
});

const style = document.createElement('style');
style.textContent = `
:root { color-scheme: dark; font-family: Inter, system-ui, sans-serif; background:#0b0c11; color:#f0f1f8; }
*{box-sizing:border-box} body{margin:0}.blocked-shell{min-height:100vh;display:grid;place-items:center;padding:22px}.blocked-card{width:min(530px,100%);border:1px solid #30364a;background:#12141c;border-radius:12px;padding:34px;text-align:center;box-shadow:0 25px 70px rgba(0,0,0,.45)}.lens-mark{color:#b8a6ff;font:22px ui-monospace,monospace}.eyebrow{color:#b8a6ff;letter-spacing:.14em;font:11px ui-monospace,monospace;margin-top:18px}h1{font-size:30px;letter-spacing:-.04em;margin:10px 0}p{color:#aab1c5;line-height:1.55}.target{border:1px solid #3c4359;background:#0c0e15;color:#e4ddff;font:12px ui-monospace,monospace;overflow-wrap:anywhere;padding:10px;border-radius:6px;margin:20px 0}.actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}button{font:600 12px inherit;border:1px solid #b8a6ff;background:#9b7cff;color:#171224;border-radius:6px;padding:10px 13px;cursor:pointer}.secondary{color:#f0f1f8;background:#1b1e29;border-color:#454b61}a{display:inline-block;color:#b8a6ff;font-size:12px;margin-top:20px}
`;
document.head.append(style);
