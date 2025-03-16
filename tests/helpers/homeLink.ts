import { Page, expect } from '@playwright/test';

export async function checkHomeLink(
  page: Page,
  args: { title: string; href: string }
) {
  const link = page.getByTitle(args.title);
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', args.href);
}
