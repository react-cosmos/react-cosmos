// @flow

export type UrlStatus = 'unknown' | 'ok' | 'error';
export type RuntimeStatus = 'pending' | 'connected' | 'error';

export type RendererPreviewSpec = {
  name: 'rendererPreview',
  state: {
    urlStatus: UrlStatus,
    runtimeStatus: RuntimeStatus
  },
  methods: {
    getUrlStatus(): UrlStatus,
    getRuntimeStatus(): RuntimeStatus
  }
};
