export function getStaticPath(relPath: string) {
  return new URL(`../static/${relPath}`, import.meta.url).pathname;
}
