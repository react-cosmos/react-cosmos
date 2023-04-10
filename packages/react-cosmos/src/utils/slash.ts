// Copied from https://github.com/sindresorhus/slash/blob/205c404ecf35b7a7a8a687d8d3b79101aaaa9fba/index.js
export function slash(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);

  return isExtendedLengthPath ? path : path.replace(/\\/g, '/');
}
