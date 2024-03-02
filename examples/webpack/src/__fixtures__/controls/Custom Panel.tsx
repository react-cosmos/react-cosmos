import React from 'react';
import { useCosmosInput, useCosmosSelect } from 'react-cosmos/client';

export default () => {
  const [name] = useCosmosInput('name', 'Mark Normand');
  const [age] = useCosmosInput('age', 39);
  const [comedy] = useCosmosInput('comedy', true);
  const [special, setSpecial] = useCosmosSelect('special', {
    options: ['Still Got It', "Don't Be Yourself", 'Out to Lunch'],
    defaultValue: 'Out to Lunch',
  });
  const [podcast] = useCosmosInput('podcast', {
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
