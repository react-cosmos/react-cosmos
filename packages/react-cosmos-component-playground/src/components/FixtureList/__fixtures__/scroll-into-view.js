const fixtures = [];
for (let i = 0; i < 100; i++) {
  fixtures.push(`fixture${i}`);
}

export default {
  props: {
    fixtures: {
      ComponentA: fixtures,
      ComponentB: ['baz', 'qux']
    },
    urlParams: {
      component: 'ComponentB',
      fixture: 'baz'
    },
    onUrlChange: () => {}
  }
};
