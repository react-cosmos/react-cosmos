import { Component } from 'react';
import { object } from 'prop-types';

// Heads up: This is tied to React Router internals and is subject to change
const getPathFromContext = context => context.router.route.location.pathname;

export default class LocationInterceptor extends Component {
  static contextTypes = {
    router: object,
  };

  componentDidUpdate(prevProps, prevState, prevContext) {
    const newPath = getPathFromContext(this.context);
    if (newPath !== getPathFromContext(prevContext)) {
      this.props.onLocation(newPath);
    }
  }

  render() {
    return this.props.children;
  }
}
