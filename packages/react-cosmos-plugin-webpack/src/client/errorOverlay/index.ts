declare var __DEV__: boolean;

if (__DEV__) {
  require('./reactErrorOverlay.js').init();
}

export function dismissErrorOverlay() {
  if (__DEV__) {
    require('./reactErrorOverlay.js').dismiss();
  }
}
