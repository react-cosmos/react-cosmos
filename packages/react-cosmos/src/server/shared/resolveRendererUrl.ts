export function resolveRendererUrl(publicUrl: string, filename: string) {
  if (publicUrl === './') return filename;
  if (publicUrl.endsWith('/')) return publicUrl + filename;
  return `${publicUrl}/${filename}`;
}
