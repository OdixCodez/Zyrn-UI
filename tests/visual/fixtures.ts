import type { Page } from '@playwright/test';

export type ZyrnVisualTheme = 'ink' | 'paper';

export interface ZyrnVisualCase {
  id: string;
  theme: ZyrnVisualTheme;
  viewport: { width: number; height: number };
  fullPage?: boolean;
}

export async function stabilizeZyrnGallery(page: Page, theme: ZyrnVisualTheme) {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
  });

  if (theme === 'paper') {
    await page.getByRole('button', { name: /switch from ink theme/i }).click();
    await page.locator('[data-theme="paper"]').waitFor();
  }
}
