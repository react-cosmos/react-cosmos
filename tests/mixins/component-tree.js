var _ = require('lodash'),
    Cosmos = require('../../cosmos.js'),
    ComponentTreeMixin = require('../../mixins/component-tree.js');

describe('ComponentTree mixin', function() {
  var fakeComponent;

  beforeEach(function() {
    fakeComponent = _.clone(ComponentTreeMixin);

    // Mock React API
    fakeComponent.props = {};
    fakeComponent.state = {};
    fakeComponent.replaceState = sinon.spy();
  });

  describe('loading children', function() {
    beforeEach(function() {
      sinon.stub(Cosmos, 'createElement');
    });

    afterEach(function() {
      Cosmos.createElement.restore();
    });

    it('should use props from .children function', function() {
      fakeComponent.children = {
        son: function() {
          return {
            component: 'Child',
            age: 13
          };
        }
      };

      fakeComponent.loadChild('son');

      var createElementProps = Cosmos.createElement.lastCall.args[0];
      expect(createElementProps.component).to.equal('Child');
      expect(createElementProps.age).to.equal(13);
    });

    it('should use ref from .children function when specified', function() {
      fakeComponent.children = {
        son: function() {
          return {
            component: 'Child',
            ref: 'junior'
          };
        }
      };

      fakeComponent.loadChild('son');

      var createElementProps = Cosmos.createElement.lastCall.args[0];
      expect(createElementProps.ref).to.equal('junior');
    });

    it('should pass on component lookup to children', function() {
      fakeComponent.children = {
        son: function() {
          return {};
        }
      };
      fakeComponent.props.componentLookup = function() {};

      fakeComponent.loadChild('son');

      var createElementProps = Cosmos.createElement.lastCall.args[0];
      expect(createElementProps.componentLookup)
            .to.equal(fakeComponent.props.componentLookup);
    });

    it('should pass extra loadChild args to children function', function() {
      fakeComponent.children = {
        son: sinon.spy()
      };

      fakeComponent.loadChild('son', 'one', 'two', 'three');

      expect(fakeComponent.children.son)
            .to.have.been.calledWith('one', 'two', 'three');
    });
  });

  describe('loading missing children', function() {
    beforeEach(function() {
      sinon.stub(console, 'error');

      sinon.stub(Cosmos, 'createElement', function() {
        throw new Error('Invalid component');
      });

      fakeComponent.children = {
        son: function() {
          return {
            component: 'MissingChild'
          };
        }
      };
    });

    afterEach(function() {
      console.error.restore();

      Cosmos.createElement.restore();
    });

    it('should not throw error', function() {
      expect(function whereAreYouSon() {
        fakeComponent.loadChild('son');
      }).to.not.throw();
    });

    it('should call console.error', function() {
      fakeComponent.loadChild('son');

      expect(console.error.lastCall.args[0]).to.be.an.instanceof(Error);
    });
  });

  describe('injecting state', function() {
    beforeEach(function() {
      sinon.stub(Cosmos, 'createElement');
    });

    afterEach(function() {
      Cosmos.createElement.restore();
    });

    it('should load their state from the state prop', function() {
      fakeComponent.props.state = {
        mood: 'indifferent',
        nevermind: true
      };

      fakeComponent.componentWillMount();

      var replaceStateArgs = fakeComponent.replaceState.lastCall.args[0];
      expect(replaceStateArgs.mood).to.equal('indifferent');
      expect(replaceStateArgs.nevermind).to.equal(true);
    });

    it('should extend received state with initial state', function() {
      fakeComponent.getInitialState = function() {
        return {
          always: 'curious'
        };
      };
      fakeComponent.props.state = {
        mood: 'indifferent'
      };

      fakeComponent.componentWillMount();

      var replaceStateArgs = fakeComponent.replaceState.lastCall.args[0];
      expect(replaceStateArgs.mood).to.equal('indifferent');
      expect(replaceStateArgs.always).to.equal('curious');
    });

    describe('recursively', function() {
      beforeEach(function() {
        fakeComponent.children = {
          son: function() {
            return {};
          }
        };
        fakeComponent.props.state = {
          children: {
            son: {
              witty: true
            }
          }
        };
        fakeComponent.componentWillMount();
      });

      it('should inject state into children recursively', function() {
        fakeComponent.loadChild('son');

        var createElementProps = Cosmos.createElement.lastCall.args[0];
        expect(createElementProps.state.witty).to.equal(true);
      });

      it('should not send state to children after the first time', function() {
        fakeComponent.componentDidMount();
        fakeComponent.loadChild('son');

        var createElementProps = Cosmos.createElement.lastCall.args[0];
        expect(createElementProps.state).to.equal(undefined);
      });
    });

    it('should inject state into children with dynamic refs', function() {
      fakeComponent.children = {
        son: function(nr) {
          return {
            ref: 'son' + nr
          };
        }
      };
      fakeComponent.props.state = {
        children: {
          son1: {
            witty: true
          },
          son2: {
            witty: false
          }
        }
      };
      fakeComponent.componentWillMount();

      fakeComponent.loadChild('son', 1);
      fakeComponent.loadChild('son', 2);

      var createElementArgs = Cosmos.createElement.args;
      expect(createElementArgs[0][0].state.witty).to.equal(true);
      expect(createElementArgs[1][0].state.witty).to.equal(false);
    });
  });

  describe('serializing', function() {
    beforeEach(function() {
      sinon.stub(Cosmos, 'createElement');
    });

    afterEach(function() {
      Cosmos.createElement.restore();
    });

    it('should generate snapshot with props', function() {
      fakeComponent.props.players = 5;

      var snapshot = fakeComponent.serialize();
      expect(snapshot.players).to.equal(5);
    });

    it('should omit state prop', function() {
      fakeComponent.props.state = {};

      var snapshot = fakeComponent.serialize();
      expect(snapshot.state).to.equal(undefined);
    });

    it('should generate snapshot with state', function() {
      fakeComponent.state.speed = 1;

      var snapshot = fakeComponent.serialize();
      expect(snapshot.state.speed).to.equal(1);
    });

    it('should omit children state key', function() {
      fakeComponent.state = {
        speed: 1,
        children: {}
      };

      var snapshot = fakeComponent.serialize();
      expect(snapshot.state.children).to.equal(undefined);
    });

    it('should generate snapshot with nested child state', function() {
      fakeComponent.refs = {
        son: {
          serialize: function() {
            return {
              component: 'Child',
              state: {
                age: 5
              }
            };
          }
        }
      };

      var snapshot = fakeComponent.serialize(true);
      expect(snapshot.state.children.son.age).to.equal(5);
    });
  });
});
