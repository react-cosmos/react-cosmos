import React from 'react';
import { getGitHubContributors } from '../shared/gitHub';

const TIMEOUT_TS = 1000;

export function useGitHubContributors() {
  const [contributors, setContributors] = React.useState<null | number>(null);

  React.useEffect(() => {
    let mounted = true;

    const timeoutId = setTimeout(() => {
      if (mounted) setContributors(getDefaultGhContributors());
    }, TIMEOUT_TS);

    try {
      getGitHubContributors().then(ghContributors => {
        if (mounted) {
          clearTimeout(timeoutId);
          setContributors(ghContributors);
        }
      });
    } catch (err) {
      console.log('Failed to fetch GH contributors:');
      console.log(err);
    }

    return () => {
      clearTimeout(timeoutId);
      mounted = false;
    };
  }, []);

  return contributors;
}

function getDefaultGhContributors(): number {
  // @ts-ignore
  return typeof GH_CONTRIBUTORS === 'number' ? GH_CONTRIBUTORS : 74;
}
