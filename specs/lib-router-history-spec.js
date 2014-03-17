var Cosmos = require('../build/cosmos.js');

describe("Cosmos.RouterHistory", function() {

  it("should start empty", function() {
    var history = new Cosmos.RouterHistory();
    expect(history.length).toEqual(0);
  });

  it("should initialize with first entry", function() {
    var history = new Cosmos.RouterHistory(),
        transition = history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    expect(transition).toEqual(Cosmos.RouterHistory.transitionTypes.INITIAL);
    expect(history.length).toEqual(1);
    expect(history[0].props).toEqual({
      component: 'List',
      dataUrl: 'users.json'
    });
  });

  it("should create new entry if not in history", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    var transition = history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    expect(transition).toEqual(Cosmos.RouterHistory.transitionTypes.NEW);
  });

  it("should update length when pushing entries", function() {
    var history = new Cosmos.RouterHistory();
    expect(history.length).toBe(0);
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    expect(history.length).toBe(1);
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    expect(history.length).toBe(2);
  });

  it("should update index when pushing entries", function() {
    var history = new Cosmos.RouterHistory();
    expect(history.index).toBe(undefined);
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    expect(history.index).toBe(0);
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    expect(history.index).toBe(1);
  });

  it("should cache query string from props when pushing an entry", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    expect(history[0].queryString).toEqual('component=List&dataUrl=users.json');
  });

  it("should ignore when pushing same entry", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    var transition = history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    expect(transition).toEqual(Cosmos.RouterHistory.transitionTypes.NOOP);
    expect(history.index).toEqual(0);
    expect(history.length).toEqual(1);
  });

  it("should preserve more than one past entry", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    transition = history.push({props: {
      component: 'Picture',
      dataUrl: 'picture.jpg'
    }});
    expect(history.length).toEqual(3);
    expect(history.index).toEqual(2);
    expect(history[0].props).toEqual({
      component: 'List',
      dataUrl: 'users.json'
    });
    expect(history[1].props).toEqual({
      component: 'User',
      dataUrl: 'user.json'
    });
    expect(history[2].props).toEqual({
      component: 'Picture',
      dataUrl: 'picture.jpg'
    });
  });

  it("should preserve more than one future entry", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    history.push({props: {
      component: 'Picture',
      dataUrl: 'picture.jpg'
    }});
    // Going back to first entry
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    expect(history.length).toEqual(3);
    expect(history.index).toEqual(0);
    expect(history[0].props).toEqual({
      component: 'List',
      dataUrl: 'users.json'
    });
    expect(history[1].props).toEqual({
      component: 'User',
      dataUrl: 'user.json'
    });
    expect(history[2].props).toEqual({
      component: 'Picture',
      dataUrl: 'picture.jpg'
    });
  });

  it("should go back when pushing a previous entry", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    // Go back
    var transition = history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    expect(transition).toEqual(Cosmos.RouterHistory.transitionTypes.BACK);
    expect(history.length).toEqual(2);
    expect(history.index).toEqual(0);
  });

  it("should go forward when pushing an entry we went back from", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    // Go back...
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    // and go forward again
    var transition = history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    expect(transition).toEqual(Cosmos.RouterHistory.transitionTypes.FORWARD);
    expect(history.length).toEqual(2);
    expect(history.index).toEqual(1);
  });

  it("should reuse future entries if returning the same way", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    history.push({props: {
      component: 'Picture',
      dataUrl: 'picture.jpg'
    }});
    // Go back...
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    // Embed some property in the farthest entry to make sure it won't be
    // replaced
    history[2].sameEntry = true;
    // and go forward again
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    var transition = history.push({props: {
      component: 'Picture',
      dataUrl: 'picture.jpg'
    }});
    expect(history.length).toEqual(3);
    expect(history.index).toEqual(2);
    expect(history[2].sameEntry).toBe(true);
  });

  it("should clear future entries if branching out to a new entry", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    history.push({props: {
      component: 'Picture',
      dataUrl: 'picture.jpg'
    }});
    // Go back...
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    // This is a different user so we'll replace the first one visited and the
    // next Picture entry
    history.push({props: {
      component: 'User',
      dataUrl: 'user2.json'
    }});
    expect(history.length).toEqual(2);
    expect(history.index).toEqual(1);
  });

  it("should preserve updated props when pushing a previous entry", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    history[history.index].laterProp = true;
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    // Go back
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    expect(history[history.index].laterProp).toEqual(true);
  });

  it("should preserve updated props when pushing an entry we went back from", function() {
    var history = new Cosmos.RouterHistory();
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    history[history.index].laterProp = true;
    // Go back...
    history.push({props: {
      component: 'List',
      dataUrl: 'users.json'
    }});
    // and go forward again
    history.push({props: {
      component: 'User',
      dataUrl: 'user.json'
    }});
    expect(history[history.index].laterProp).toEqual(true);
  });
});
