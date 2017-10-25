import React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';

const NoRoute = () => (
  <div>
    <p>No route selected.</p>
    <p>
      <Link to="/a">
        Go to <strong>A</strong>
      </Link>
    </p>
    <p>
      <Link to="/b">
        Go to <strong>B</strong>
      </Link>
    </p>
    <p>
      <Link to="/b?query=true#hash">
        Go to <strong>B?query=true#hash</strong>
      </Link>
    </p>
    <p>
      <Link to={{ pathname: '/b', state: { from: 'component' } }}>
        Go to <strong>B with state</strong>
      </Link>
    </p>
  </div>
);

const RouteItem = ({ name, location: { search, hash, state } }) => (
  <div>
    <p>
      Route <strong>{name}</strong> selected.
    </p>
    {search && (
      <p>
        Query string value specified: <strong>{search}</strong>
      </p>
    )}
    {hash && (
      <p>
        Hash value specified: <strong>{hash}</strong>
      </p>
    )}
    {state && (
      <div>
        <p>State provided:</p>
        <strong>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </strong>
      </div>
    )}
    <p>
      <Link to="/">Go to index</Link>
    </p>
  </div>
);

const RouteA = props => <RouteItem name="A" {...props} />;
const RouteB = props => <RouteItem name="B" {...props} />;

export default () => (
  <div>
    <Switch>
      <Route exact path="/a" component={RouteA} />
      <Route exact path="/b" component={RouteB} />
      <Route component={NoRoute} />
    </Switch>
  </div>
);
