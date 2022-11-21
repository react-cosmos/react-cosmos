declare var __DEV__: boolean;

if (__DEV__) {
  (await import('./reactErrorOverlay.js')).init();
}

export async function dismissErrorOverlay() {
  if (__DEV__) {
    (await import('./reactErrorOverlay.js')).dismiss();
  }
}
