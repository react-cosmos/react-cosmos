export const livePreviewUrl =
  process.env.NODE_ENV === 'production'
    ? '/live-demo/'
    : 'http://localhost:5000';
