import React, { useEffect, useRef } from 'react';

export default (
  <Comedian
    name="Mark Normand"
    age={39}
    comedy={true}
    specials={['Still Got It', "Don't Be Yourself", 'Out to Lunch']}
    podcast={{
      name: 'Tuesdays with Stories',
      cohost: 'Joe List',
      episodes: 300,
      endDate: null,
      tagRegex: /itsallpipes/g,
    }}
    onCallback={() => 'yes'}
  />
);

function Comedian(props: Record<string, any>) {
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) {
      // console.log('Props change');
    } else {
      mounted.current = true;
      // console.log('New instance');
    }
  });

  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}
