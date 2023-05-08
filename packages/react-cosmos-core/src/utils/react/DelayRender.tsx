import React from 'react';

// Delay the rendering of children until after a short amount of time. One
// common use case is to prevent flashing loading screens when the loading
// state goes away quick enough.
type Props = {
  children: React.ReactNode;
  delay: number;
};
export function DelayRender(props: Props) {
  const [render, setRender] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => setRender(true), props.delay);
    return () => clearTimeout(timeoutId);
  }, [props.delay]);

  return <>{render && props.children}</>;
}
