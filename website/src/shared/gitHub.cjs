// TODO: Remove this duplicate file once Cosmos supports ES webpack config
// via dynamic import().

exports.getGitHubStars = async () => {
  const res = await fetchGithub(`repos/react-cosmos/react-cosmos`);
  const parsedRes = await res.json();
  if (isNaN(parsedRes.stargazers_count))
    throw new Error(`Stargazers count missing`);
  return parsedRes.stargazers_count;
};

exports.getGitHubContributors = async () => {
  const res = await fetchGithub(
    `repos/react-cosmos/react-cosmos/contributors?per_page=1000`
  );
  const parsedRes = await res.json();
  if (!Array.isArray(parsedRes)) throw new Error(`Contributors missing`);
  return parsedRes.length;
};

function fetchGithub(path) {
  // https://developer.github.com/v3/#rate-limiting
  return fetch(`https://api.github.com/${path}`);
}
