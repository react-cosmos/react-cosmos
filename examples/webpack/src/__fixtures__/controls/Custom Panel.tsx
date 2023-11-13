import React from 'react';
import { useSelect, useValue } from 'react-cosmos/client';

export default () => {
  const [name] = useValue('name', { defaultValue: 'Mark Normand' });
  const [age] = useValue('age', { defaultValue: 39 });
  const [comedy] = useValue('comedy', { defaultValue: true });
  const [special, setSpecial] = useSelect('special', {
    options: ['Still Got It', "Don't Be Yourself", 'Out to Lunch'],
    defaultValue: 'Out to Lunch',
  });
  const [podcast] = useValue('podcast', {
    defaultValue: {
      name: 'Tuesdays with Stories',
      cohost: 'Joe List',
      episodes: 300,
      endDate: null,
      tagRegex: /itsallpipes/g,
    },
  });

  function renderButton(option: typeof special) {
    return (
      <button disabled={special === option} onClick={() => setSpecial(option)}>
        {option}
      </button>
    );
  }

  return (
    <>
      <MyComponent name={name} age={age} comedy={comedy} podcast={podcast} />
      <div>
        {renderButton('Still Got It')}
        {renderButton("Don't Be Yourself")}
        {renderButton('Out to Lunch')}
      </div>
    </>
  );
};

function MyComponent(props: Record<string, any>) {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}
