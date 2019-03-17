import * as React from 'react';

export type ElRefs = { [elPath: string]: React.Component };

export type InitialStates = {
  [elPath: string]: {
    type: React.ComponentClass<any>;
    // "The state [...] should be a plain JavaScript object."
    // https://reactjs.org/docs/react-component.html#state
    state: {};
  };
};
