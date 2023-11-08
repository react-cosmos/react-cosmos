import React from 'react';

const repoUrl = 'https://api.github.com/repos/react-cosmos/react-cosmos';
const starsFallback = 7905;

export async function getStargazersCount() {
  try {
    const res = await fetch(repoUrl);
    const repo = await res.json();
    return repo.stargazers_count ?? 0;
  } catch (err) {
    return starsFallback;
  }
}

const animationDuration = 1000; // ms

export function useStargazersCount(initialCount: number) {
  const [count, setCount] = React.useState(initialCount);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    (async () => {
      const latestCount = await getStargazersCount();
      if (latestCount > initialCount) {
        const diff = latestCount - initialCount;
        const step = animationDuration / diff;
        let currentCount = initialCount;

        const update = () => {
          currentCount += 1;
          setCount(currentCount);
          if (currentCount < latestCount) {
            timeoutId = setTimeout(update, randomStep(step));
          }
        };
        timeoutId = setTimeout(update, randomStep(step));
      }
    })();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [initialCount]);

  return count;
}

function randomStep(step: number) {
  return Math.random() * step * 2;
}
