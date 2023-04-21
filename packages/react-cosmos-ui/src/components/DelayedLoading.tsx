import React, { ReactNode, useEffect, useState } from 'react';

type DelayedLoadingProps = {
  children: ReactNode;
  delay?: number;
};
export function DelayedLoading(props: DelayedLoadingProps) {
  const [loading, setLoading] = useState(false);

  // Only enter loading state if this component remains rendered after after a
  // short amount of time. This prevents flashing loading screens when the
  // requests take only a moment to complete.
  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(true), props.delay ?? 400);
    return () => clearTimeout(timeoutId);
  }, [props.delay]);

  return <>{loading && props.children}</>;
}
