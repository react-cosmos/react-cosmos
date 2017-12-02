import ResponsiveLoader from '../index';

export default {
  component: ResponsiveLoader,

  props: {
    src: '/mock/loader/index.html',
    showResponsiveControls: true,
    onFixtureUpdate: args => console.log(args),
    fixture: { width: 1000, height: 800 }
  }
};
