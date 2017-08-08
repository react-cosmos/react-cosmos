import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';

const NoRoute = () =>
  <div>
    <p>No route selected. </p>
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
  </div>;

const RouteA = () =>
  <div>
    <p>
      Route <strong>A</strong> selected.
    </p>
    <p>
      <Link to="/">Go to index</Link>
    </p>
  </div>;

const RouteB = () =>
  <div>
    <p>
      Route <strong>B</strong> selected.
    </p>
    <p>
      <Link to="/">Go to index</Link>
    </p>
  </div>;

export default class RouteSwitch extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/a" component={RouteA} />
          <Route exact path="/b" component={RouteB} />
          <Route component={NoRoute} />
        </Switch>
      </div>
    );
  }
}
