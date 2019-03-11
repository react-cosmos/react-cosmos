declare module '@react-mock/state' {
  import * as React from 'react';

  type Props = {
    children: React.ReactElement<any>;
    state: object;
  };

  export declare function StateMock(props: Props);
}
