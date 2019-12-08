export function fetchGithub(path: string) {
  // https://developer.github.com/v3/#rate-limiting
  return fetch(`https://api.github.com/${path}`);
}
