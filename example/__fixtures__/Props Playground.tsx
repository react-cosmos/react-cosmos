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
      unserializable: /findmeifukanye/g
    }}
    unserializable={() => 'yes'}
  />
);

function MyComponent(props: Record<string, any>) {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}
