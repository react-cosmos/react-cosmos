import ResponsiveLoader from '../index';

export default {
  component: ResponsiveLoader,

  props: {
    src: '/mock/loader/index.html',
    showResponsiveControls: true,
    onFixtureUpdate: args => console.log(args),
    fixture: { width: 1000, height: 800 },
    devices: [
      { label: 'iPhone 5', width: 320, height: 568 },
      { label: 'iPhone 6', width: 375, height: 667 }
    ]
  }
};
