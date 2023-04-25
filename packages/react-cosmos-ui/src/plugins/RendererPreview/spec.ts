export type RuntimeStatus = 'pending' | 'connected' | 'error';

export type RendererPreviewSpec = {
  name: 'rendererPreview';
  state: {
    runtimeStatus: RuntimeStatus;
  };
  methods: {
    getRuntimeStatus(): RuntimeStatus;
  };
};
