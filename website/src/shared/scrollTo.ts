// https://stackoverflow.com/questions/52276194/window-scrollto-with-options-not-working-on-microsoft-edge
const supportsNativeSmoothScroll =
  'scrollBehavior' in document.documentElement.style;

export function scrollTo(top: number) {
  if (supportsNativeSmoothScroll) {
    window.scrollTo({ top, behavior: 'smooth' });
  } else {
    window.scroll(0, top);
  }
}
