const headerHeight = 81;

// https://stackoverflow.com/questions/52276194/window-scrollto-with-options-not-working-on-microsoft-edge
const supportsNativeSmoothScroll =
  'scrollBehavior' in document.documentElement.style;

export function scrollToElement(element: HTMLElement) {
  scrollTo(getElementTop(element));
}

function getElementTop(element: HTMLElement) {
  const availWindowHeight = window.innerHeight - headerHeight;
  const elRect = element.getBoundingClientRect();
  const elScrollTop = elRect.top + pageYOffset - headerHeight;

  if (elRect.height >= availWindowHeight) {
    return Math.ceil(elScrollTop);
  }

  const yPadding = (availWindowHeight - elRect.height) / 2;
  return Math.ceil(elScrollTop - yPadding);
}

function scrollTo(top: number) {
  if (supportsNativeSmoothScroll) {
    window.scrollTo({ top, behavior: 'smooth' });
  } else {
    window.scroll(0, top);
  }
}
