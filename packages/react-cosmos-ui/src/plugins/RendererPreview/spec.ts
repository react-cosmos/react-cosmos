export type RuntimeStatus = 'pending' | 'connected' | 'error';

export type RendererPreviewSpec = {
  name: 'rendererPreview';
  config: {
    backgroundColor: string;
  };
  state: {
    runtimeStatus: RuntimeStatus;
  };
  methods: {
    getRuntimeStatus(): RuntimeStatus;
  };
};
