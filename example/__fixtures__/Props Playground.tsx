import React from 'react';

export default (
  <MyComponent
    string="How are you doing?"
    number={1989}
    boolean={false}
    object={{
      string: "Pretty good can't complain",
      number: 1337,
      object: {
        number: 555
      },
      null: null,
      unserializable: /findmeifukanye/g
    }}
    unserializable={() => 'yes'}
  />
);

function MyComponent(props: Record<string, any>) {
  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (mounted.current) {
      console.log('Props change');
    } else {
      mounted.current = true;
      console.log('New instance');
    }
  });

  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}
