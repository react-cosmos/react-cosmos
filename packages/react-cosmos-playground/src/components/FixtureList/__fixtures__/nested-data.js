import FixtureList from '..';

export default {
  component: FixtureList,

  props: {
    options: {
      projectKey: 'test'
    },
    fixtures: {
      'dirA/Component1': ['fixtureA', 'fixtureB'],
      'dirB/Component2': ['fixtureA', 'fixtureB'],
      'dirB/Component3': [
        'Some folder/fixtureA',
        'Some folder/fixtureB',
        'Another folder/fixtureC',
        'fixtureD'
      ],
      'dirB/subdirA/Component4': ['fixtureA', 'fixtureB']
    },
    urlParams: {},
    onUrlChange: url => {
      console.log('New url:', url);
    }
  }
};
