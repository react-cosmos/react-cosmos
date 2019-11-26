import React from 'react';

const DEFAULT_STARS = 5600;
const TIMEOUT_TS = 500;

export function useGitHubStars() {
  const [stars, setStars] = React.useState<null | number>(null);

  React.useEffect(() => {
    let mounted = true;

    const timeoutId = setTimeout(() => {
      if (mounted) setStars(DEFAULT_STARS);
    }, TIMEOUT_TS);

    // https://developer.github.com/v3/#rate-limiting
    fetch(`https://api.github.com/repos/react-cosmos/react-cosmos`).then(
      async res => {
        const parsedRes = await res.json();
        if (mounted && !isNaN(parsedRes.stargazers_count)) {
          clearTimeout(timeoutId);
          setStars(Number(parsedRes.stargazers_count));
        }
      }
    );

    return () => {
      clearTimeout(timeoutId);
      mounted = false;
    };
  }, []);

  return stars;
}
