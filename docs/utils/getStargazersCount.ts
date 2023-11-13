const repoUrl = 'https://api.github.com/repos/react-cosmos/react-cosmos';
const fallbackCount = 7912;

export async function getStargazersCount() {
  try {
    const res = await fetch(repoUrl);
    const repo = await res.json();
    return repo.stargazers_count ?? fallbackCount;
  } catch (err) {
    return fallbackCount;
  }
}
