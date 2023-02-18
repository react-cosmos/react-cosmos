// resolveUrlPath('/', '_renderer.html') => '/_renderer.html'
// resolveUrlPath('./', '_renderer.html') => '/_renderer.html'
// resolveUrlPath('http://localhost:5000', '_renderer.html') => 'http://localhost:5000/_renderer.html'

export function resolveUrlPath(base: string, urlPath: string) {
  // The 'resolve://' protocol is only added when base is a relative URL.
  const resolvedUrl = new URL(urlPath, new URL(base, 'resolve://'));

  if (resolvedUrl.protocol === 'resolve:') {
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }

  return resolvedUrl.toString();
}
