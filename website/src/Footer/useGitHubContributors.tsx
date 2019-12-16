import React from 'react';
import { fetchGithub } from '../shared/gitHub';

const DEFAULT_CONTRIBUTORS = 74;
const TIMEOUT_TS = 500;

export function useGitHubContributors() {
  const [contributors, setContributors] = React.useState<null | number>(null);

  React.useEffect(() => {
    let mounted = true;

    const timeoutId = setTimeout(() => {
      if (mounted) setContributors(DEFAULT_CONTRIBUTORS);
    }, TIMEOUT_TS);

    fetchGithub(
      `repos/react-cosmos/react-cosmos/contributors?per_page=1000`
    ).then(async res => {
      const parsedRes = await res.json();
      if (mounted && Array.isArray(parsedRes)) {
        clearTimeout(timeoutId);
        setContributors(parsedRes.length);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      mounted = false;
    };
  }, []);

  return contributors;
}
