import { expect, test } from '@playwright/test';
import { stabilizeZyrnGallery, type ZyrnVisualCase } from './fixtures';

const baselineCases: ZyrnVisualCase[] = [
  {
    id: 'gallery-desktop-ink',
    theme: 'ink',
    viewport: { width: 1440, height: 1000 },
    fullPage: true,
  },
  {
    id: 'gallery-mobile-paper',
    theme: 'paper',
    viewport: { width: 390, height: 844 },
    fullPage: true,
  },
];

for (const visualCase of baselineCases) {
  test(visualCase.id, async ({ page }) => {
    await page.setViewportSize(visualCase.viewport);
    await stabilizeZyrnGallery(page, visualCase.theme);

    await expect(page).toHaveScreenshot(`${visualCase.id}.png`, {
      fullPage: visualCase.fullPage,
    });
  });
}

test('feedback states in ink theme', async ({ page }) => {
  await stabilizeZyrnGallery(page, 'ink');
  const feedbackCard = page.locator('.zyrn-card').filter({ hasText: 'Feedback states' });

  await expect(feedbackCard).toHaveScreenshot('feedback-states-ink.png');
});

test('modal focus treatment in ink theme', async ({ page }) => {
  await stabilizeZyrnGallery(page, 'ink');
  await page.getByRole('button', { name: /open modal/i }).click();
  const dialog = page.getByRole('dialog');

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveScreenshot('modal-focus-ink.png');
});

test('keyboard-open context menu in paper theme', async ({ page }) => {
  await stabilizeZyrnGallery(page, 'paper');
  const trigger = page.getByRole('button', { name: /right-click operations/i });

  await trigger.focus();
  await trigger.press('Shift+F10');
  const menu = page.getByRole('menu');

  await expect(menu).toBeVisible();
  await expect(menu).toHaveScreenshot('context-menu-keyboard-paper.png');
});
