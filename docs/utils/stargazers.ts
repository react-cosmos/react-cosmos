import React from 'react';

export async function getStargazersCount() {
  const res = await fetch(
    `https://api.github.com/repos/react-cosmos/react-cosmos`
  );
  const repo = await res.json();
  return repo.stargazers_count ?? 0;
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
