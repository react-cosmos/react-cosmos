import React from 'react';

export default ({ location, match, history }) => (
  <div>
    <div>Location:</div>
    <pre>{JSON.stringify(location, null, 2)}</pre>
    <div>Match:</div>
    <pre>{JSON.stringify(match, null, 2)}</pre>
    <div>History:</div>
    <pre>{JSON.stringify(history, null, 2)}</pre>
  </div>
);
