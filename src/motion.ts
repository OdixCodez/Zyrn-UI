// zyrn-ui motion system
// Lightweight, zero-dependency, DOM-native animation primitives.

export const Frames = {
  one: 120,
  two: 180,
  three: 240,
  four: 300,
  six: 420,
  eight: 560,
} as const;

export const Easing = {
  dash: 'cubic-bezier(0.22, 1, 0.36, 1)',
  snap: 'cubic-bezier(0.2, 0, 0.2, 1)',
  strike: 'cubic-bezier(0.4, 0, 0.2, 1)',
  settle: 'cubic-bezier(0.16, 1, 0.3, 1)',
  whip: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
  impact: 'cubic-bezier(0.15, 0, 0.3, 1.2)',
  drip: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
} as const;

export function zyrnAnimate(
  element: Element | null,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options?: KeyframeAnimationOptions,
): Animation | null {
  if (!element || typeof element.animate !== 'function') {
    return null;
  }

  return element.animate(keyframes, {
    duration: Frames.two,
    fill: 'forwards',
    ...options,
  });
}

export const Animations = {
  /**
   * STRIKE
   * Hard cut-in with a brief, sharp snap.
   */
  strike(element: Element): Animation | null {
    return zyrnAnimate(element, [
      { opacity: '0', transform: 'translateY(8px) scale(0.98)', filter: 'blur(4px)' },
      { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0px)', offset: 0.35 },
      { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0px)' },
    ], {
      duration: Frames.two,
      easing: Easing.strike,
    });
  },

  /**
   * IMPACT
   * Heavy, decisive burst with a blunt emphasis.
   */
  impact(element: Element): Animation | null {
    return zyrnAnimate(element, [
      { transform: 'scale(0.96) rotate(-0.5deg)', opacity: '0.9', filter: 'blur(0px)' },
      { transform: 'scale(1.02) rotate(0.75deg)', opacity: '1', filter: 'blur(0px)', offset: 0.55 },
      { transform: 'scale(1) rotate(0deg)', opacity: '1', filter: 'blur(0px)' },
    ], {
      duration: Frames.two,
      easing: Easing.impact,
    });
  },

  /**
   * WHIP
   * Quick lateral punch, as though the frame snaps into place.
   */
  whip(element: Element): Animation | null {
    return zyrnAnimate(element, [
      { transform: 'translateX(-6px) scale(0.98)', opacity: '0.75' },
      { transform: 'translateX(2px) scale(1.01)', opacity: '1', offset: 0.5 },
      { transform: 'translateX(0) scale(1)', opacity: '1' },
    ], {
      duration: Frames.two,
      easing: Easing.whip,
    });
  },

  /**
   * SETTLE
   * A calmer, deliberate landing.
   */
  settle(element: Element): Animation | null {
    return zyrnAnimate(element, [
      { transform: 'scale(0.95) rotate(1deg)', opacity: '1', filter: 'blur(0px)', offset: 0.4 },
      { transform: 'scale(1.02) rotate(-0.5deg)', offset: 0.6 },
      { transform: 'scale(1) rotate(0deg)' },
    ], {
      duration: Frames.two,
      easing: Easing.settle,
    });
  },

  /**
   * INK DRIP
   * Downward reveal like ink on vertical paper.
   */
  inkDrip(element: Element): Animation | null {
    return zyrnAnimate(element, [
      { clipPath: 'inset(0 0 100% 0)', opacity: '0' },
      { clipPath: 'inset(0 0 0% 0)', opacity: '1', offset: 0.7 },
      { clipPath: 'inset(0 0 0% 0)', opacity: '1' },
    ], {
      duration: Frames.eight,
      easing: Easing.drip,
    });
  },

  /**
   * BRUSH STROKE
   * Horizontal reveal with organic feel.
   */
  brushStroke(element: Element): Animation | null {
    return zyrnAnimate(element, [
      { clipPath: 'inset(0 100% 0 0)', opacity: '0' },
      { clipPath: 'inset(0 0% 0 0)', opacity: '1' },
    ], {
      duration: Frames.six,
      easing: Easing.dash,
    });
  },
} as const;

export const MotionClasses = {
  'zyrn-ease-dash': `transition-timing-function: ${Easing.dash}`,
  'zyrn-ease-snap': `transition-timing-function: ${Easing.snap}`,
  'zyrn-ease-strike': `transition-timing-function: ${Easing.strike}`,
  'zyrn-ease-settle': `transition-timing-function: ${Easing.settle}`,
  'zyrn-ease-whip': `transition-timing-function: ${Easing.whip}`,
  'zyrn-ease-impact': `transition-timing-function: ${Easing.impact}`,

  'zyrn-dur-1': `transition-duration: ${Frames.one}ms`,
  'zyrn-dur-2': `transition-duration: ${Frames.two}ms`,
  'zyrn-dur-3': `transition-duration: ${Frames.three}ms`,
  'zyrn-dur-4': `transition-duration: ${Frames.four}ms`,
  'zyrn-dur-6': `transition-duration: ${Frames.six}ms`,
  'zyrn-dur-8': `transition-duration: ${Frames.eight}ms`,
} as const;
