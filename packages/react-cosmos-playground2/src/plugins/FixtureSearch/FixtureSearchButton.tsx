import React from 'react';
import { KEY_P } from '../../shared/keys';

type Props = {
  onOpen: () => unknown;
};

export function FixtureSearchButton({ onOpen }: Props) {
  React.useEffect(() => {
    function handleWindowKeyDown(e: KeyboardEvent) {
      const metaKey = e.metaKey || e.ctrlKey;
      if (metaKey && e.keyCode === KEY_P) {
        e.preventDefault();
        onOpen();
      }
    }
    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  });

  return <button onClick={onOpen}>Search fixtures</button>;
}
