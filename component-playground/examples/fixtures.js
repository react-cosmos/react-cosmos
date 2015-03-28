// The Component Playground inside itself might not be the best example :)
module.exports = {
  ComponentPlayground: {
    'without fixture selected': {
      fixtures: {
        ComponentPlayground: {
          'without fixture selected': {},
          'with fixture selected': {}
        }
      }
    },
    'with expanded component': {
      fixtures: {
        ComponentPlayground: {
          'without fixture selected': {},
          'with fixture selected': {}
        }
      },
      state: {
        expandedComponents: ['ComponentPlayground']
      }
    },
    'with fixture selected': {
      fixtures: {
        ComponentPlayground: {
          'without fixture selected': {},
          'with fixture selected': {}
        }
      },
      selectedComponent: 'ComponentPlayground',
      selectedFixture: 'with fixture selected'
    },
    'with fixture editor-open': {
      fixtures: {
        ComponentPlayground: {
          'only fixture': {
            fixtures: {
              ComponentPlayground: {
                'recurring fixture': {}
              }
            }
          }
        }
      },
      selectedComponent: 'ComponentPlayground',
      selectedFixture: 'only fixture',
      fixtureEditor: true
    },
    'full-screen': {
      fixtures: {
        ComponentPlayground: {
          'only fixture': {}
        }
      },
      selectedComponent: 'ComponentPlayground',
      selectedFixture: 'only fixture',
      fullScreen: true
    }
  }
};
