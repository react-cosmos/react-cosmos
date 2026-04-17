const repoUrl = 'https://api.github.com/repos/react-cosmos/react-cosmos';
const fallbackCount = 8660;

export async function getStargazersCount() {
  try {
    const res = await fetch(repoUrl);
    const repo = await res.json();
    return repo.stargazers_count ?? fallbackCount;
  } catch {
    return fallbackCount;
  }
}
