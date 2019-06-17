export function getParentButton(el: HTMLElement) {
  // FYI HTMLElement.prototype.closest was added to jsdom@11.12
  // https://github.com/jsdom/jsdom/pull/1951
  // But (as of this writing) Jest is still rocking jsdom@11.5
  // https://github.com/facebook/jest/blob/fe144931752df61d27a26afb355f2e09b9ab6d61/packages/jest-environment-jsdom/package.json#L18
  let curEl: HTMLElement | null = el;
  while (curEl) {
    if (curEl.nodeName.match(/button/i)) {
      return curEl;
    }
    curEl = curEl.parentElement;
  }

  throw new Error('No "button" parent element found');
}
