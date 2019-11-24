import React from 'react';

export function useGitHubStars() {
  const [stars, setStars] = React.useState(5600);

  React.useEffect(() => {
    let mounted = true;
    // TODO: https://developer.github.com/v3/#rate-limiting
    fetch(`https://api.github.com/repos/react-cosmos/react-cosmos`).then(
      async res => {
        const parsedRes = await res.json();
        if (mounted && !isNaN(parsedRes.stargazers_count)) {
          setStars(Number(parsedRes.stargazers_count));
        }
      }
    );
    return () => {
      mounted = false;
    };
  }, []);

  return stars;
}
