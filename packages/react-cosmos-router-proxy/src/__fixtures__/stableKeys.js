import React from 'react';
import { withRouter } from 'react-router';

const MyComponent = () => <div>MyComponent</div>;
const MyComponentWithRouter = withRouter(MyComponent);

export default {
  component: MyComponentWithRouter,
  url: '/',
  props: {}
};
