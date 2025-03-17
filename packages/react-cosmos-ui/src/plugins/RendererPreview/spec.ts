export type RuntimeStatus = 'pending' | 'connected' | 'error';

export type RendererPreviewSpec = {
  name: 'rendererPreview';
  config: {
    iframeBgColor: string;
  };
  state: {
    runtimeStatus: RuntimeStatus;
  };
  methods: {
    getRuntimeStatus(): RuntimeStatus;
  };
};
