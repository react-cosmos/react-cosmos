import React from 'react';
import { useFixtureInput, useFixtureSelect } from 'react-cosmos/client';

export default () => {
  const [name] = useFixtureInput('name', 'Mark Normand');
  const [age] = useFixtureInput('age', 39);
  const [comedy] = useFixtureInput('comedy', true);
  const [special, setSpecial] = useFixtureSelect('special', {
    options: ['Still Got It', "Don't Be Yourself", 'Out to Lunch'],
    defaultValue: 'Out to Lunch',
  });
  const [podcast] = useFixtureInput('podcast', {
    name: 'Tuesdays with Stories',
    cohost: 'Joe List',
    episodes: 300,
    endDate: null,
    tagRegex: /itsallpipes/g,
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
