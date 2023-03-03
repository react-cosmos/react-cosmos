import { resolveRendererUrl } from './resolveRendererUrl.js';

it('resolves root path', () => {
  expect(resolveRendererUrl('/', '_renderer.html')).toBe('/_renderer.html');
});

it('resolves relative path', () => {
  expect(resolveRendererUrl('./', '_renderer.html')).toBe('_renderer.html');
});

it('resolves nested path', () => {
  expect(resolveRendererUrl('/nested', '_renderer.html')).toBe(
    '/nested/_renderer.html'
  );
});

it('resolves nested path ending in slash', () => {
  expect(resolveRendererUrl('/nested/', '_renderer.html')).toBe(
    '/nested/_renderer.html'
  );
});
