var Fresh = require('../build/fresh.js');

describe("Fresh.RouterHistory", function() {

  it("should start empty", function() {
    var history = new Fresh.RouterHistory();
    expect(history.length).toEqual(0);
  });

  it("should initialize with first entry", function() {
    var history = new Fresh.RouterHistory(),
        transition = history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    expect(transition).toEqual(history.transitionTypes.INITIAL);
    expect(history.length).toEqual(1);
    expect(history[0].props).toEqual({
      component: 'List',
      dataUrl: 'users.json'
    });
  });

  it("should update length when pushing entries", function() {
    var history = new Fresh.RouterHistory();
    expect(history.length).toBe(0);
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    expect(history.length).toBe(1);
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    expect(history.length).toBe(2);
  });

  it("should update index when pushing entries", function() {
    var history = new Fresh.RouterHistory();
    expect(history.index).toBe(undefined);
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    expect(history.index).toBe(0);
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    expect(history.index).toBe(1);
  });

  it("should cache query string from props when pushing an entry", function() {
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    expect(history[0].queryString).toEqual('component=List&dataUrl=users.json');
  });

  it("should ignore when pushing same entry", function() {
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    var transition = history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    expect(transition).toEqual(history.transitionTypes.NOOP);
    expect(history.index).toEqual(0);
    expect(history.length).toEqual(1);
  });

  it("should preserve more than one past entry", function() {
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    transition = history.push({
      component: 'Picture',
      dataUrl: 'picture.jpg'
    });
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
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    history.push({
      component: 'Picture',
      dataUrl: 'picture.jpg'
    });
    // Going back to first entry
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
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
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    // Go back
    var transition = history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    expect(transition).toEqual(history.transitionTypes.BACK);
    expect(history.length).toEqual(2);
    expect(history.index).toEqual(0);
  });

  it("should go forward when pushing an entry we went back from", function() {
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    // Go back...
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    // and go forward again
    var transition = history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    expect(transition).toEqual(history.transitionTypes.FORWARD);
    expect(history.length).toEqual(2);
    expect(history.index).toEqual(1);
  });

  it("should reuse future entries if returning the same way", function() {
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    history.push({
      component: 'Picture',
      dataUrl: 'picture.jpg'
    });
    // Go back...
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    // Embed some property in the farthest entry to make sure it won't be
    // replaced
    history[2].sameEntry = true;
    // and go forward again
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    var transition = history.push({
      component: 'Picture',
      dataUrl: 'picture.jpg'
    });
    expect(history.length).toEqual(3);
    expect(history.index).toEqual(2);
    expect(history[2].sameEntry).toBe(true);
  });

  it("should clear future entries if branching out to a new entry", function() {
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    history.push({
      component: 'Picture',
      dataUrl: 'picture.jpg'
    });
    // Go back...
    history.push({
      component: 'User',
      dataUrl: 'user.json'
    });
    history.push({
      component: 'List',
      dataUrl: 'users.json'
    });
    // This is a different user so we'll replace the first one visited and the
    // next Picture entry
    history.push({
      component: 'User',
      dataUrl: 'user2.json'
    });
    expect(history.length).toEqual(2);
    expect(history.index).toEqual(1);
  });
});
