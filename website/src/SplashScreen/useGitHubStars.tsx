import React from 'react';
import { getGitHubStars } from '../shared/gitHub.js';

const TIMEOUT_TS = 1000;

export function useGitHubStars() {
  const [stars, setStars] = React.useState<null | number>(null);

  React.useEffect(() => {
    let mounted = true;

    const timeoutId = setTimeout(() => {
      if (mounted) setStars(getDefaultGhStars());
    }, TIMEOUT_TS);

    try {
      getGitHubStars().then(ghStars => {
        if (mounted) {
          clearTimeout(timeoutId);
          setStars(ghStars);
        }
      });
    } catch (err) {
      console.log('Failed to fetch GH stars:');
      console.log(err);
    }

    return () => {
      clearTimeout(timeoutId);
      mounted = false;
    };
  }, []);

  return stars;
}

function getDefaultGhStars(): number {
  // @ts-ignore
  return typeof GH_STARS === 'number' ? GH_STARS : 5600;
}
