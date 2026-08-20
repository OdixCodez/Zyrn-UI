import { useState } from 'react';

interface OnboardingProps { onComplete: (openFocus: boolean) => void; }

const screens = [
  { eyebrow: 'WELCOME TO DEVLENS', title: 'Your developer workspace for the web.', body: 'DevLens is a local-first extension for inspecting browser-visible page structure, extracting useful snippets, experimenting safely, and organizing research.' },
  { eyebrow: 'YOUR WORKFLOW', title: 'Inspect. Extract. Experiment. Research. Focus.', body: 'Select live page elements, capture available HTML and CSS, use a sandboxed playground, save local snippets, and start voluntary focus sessions when research needs your attention.' },
  { eyebrow: 'PERMISSIONS, EXPLAINED', title: 'You decide when DevLens can access a page.', body: 'Inspection uses Active Tab access only after you activate DevLens. Persistent website access, URL-aware Focus Mode, and automatic matching scripts are optional and shown clearly before browser approval.' },
  { eyebrow: 'FOCUS PROFILE', title: 'Create your first optional focus profile.', body: 'A profile is fully customizable. You choose which domains are allowed or paused, can temporarily allow a site, and can end every session immediately.' },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0); const screen = screens[step]!;
  return <div className="modal-backdrop"><section className="modal onboarding" role="dialog" aria-modal="true" aria-labelledby="onboarding-title"><p className="eyebrow">{screen.eyebrow}</p><div className="empty-mark" aria-hidden="true">&lt;◉/&gt;</div><h1 id="onboarding-title">{screen.title}</h1><p className="panel-description">{screen.body}</p><div className="onboarding-progress" aria-label={`Onboarding step ${step + 1} of ${screens.length}`}>{screens.map((_, index) => <span key={index} className={index === step ? 'active' : ''} />)}</div><div className="inline space-between" style={{ marginTop: 24 }}><button className="secondary-button" type="button" onClick={() => onComplete(false)}>{step === 0 ? 'Skip onboarding' : 'Finish later'}</button><div className="inline">{step > 0 && <button className="secondary-button" type="button" onClick={() => setStep(step - 1)}>Back</button>}{step < screens.length - 1 ? <button className="button" type="button" onClick={() => setStep(step + 1)}>Continue</button> : <button className="button" type="button" onClick={() => onComplete(true)}>Create focus profile</button>}</div></div></section></div>;
}
