var Fresh = require('../build/fresh.js');

describe("Fresh.RouterHistory", function() {

  it("should start empty", function() {
    var history = new Fresh.RouterHistory();
    expect(history.length).toEqual(0);
    expect(history.index).toEqual(undefined);
  });

  it("should cache query string from props when pushing an entry", function() {
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'List',
      data: 'users.json'
    });
    expect(history[0].queryString).toEqual('component=List&data=users.json');
    expect(history[0].props).toEqual({
      component: 'List',
      data: 'users.json'
    });
  });

  it("should initialize with first entry", function() {
    var history = new Fresh.RouterHistory(),
        transition = history.push({
      component: 'List',
      data: 'users.json'
    });
    expect(transition).toEqual(history.transitionTypes.INITIAL);
    expect(history.index).toEqual(0);
    expect(history.length).toEqual(1);
    expect(history[0].props).toEqual({
      component: 'List',
      data: 'users.json'
    });
  });

  it("should ignore when pushing same entry", function() {
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'User',
      data: 'user.json'
    });
    var transition = history.push({
      component: 'User',
      data: 'user.json'
    });
    expect(transition).toEqual(history.transitionTypes.NOOP);
    expect(history.index).toEqual(0);
    expect(history.length).toEqual(1);
    expect(history[0].props).toEqual({
      component: 'User',
      data: 'user.json'
    });
  });

  it("should go back when pushing a previous entry", function() {
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'List',
      data: 'users.json'
    });
    history.push({
      component: 'User',
      data: 'user.json'
    });
    var transition = history.push({
      component: 'List',
      data: 'users.json'
    });
    expect(transition).toEqual(history.transitionTypes.BACK);
    expect(history.index).toEqual(0);
    expect(history.length).toEqual(2);
    expect(history[0].props).toEqual({
      component: 'List',
      data: 'users.json'
    });
    // Future entry is cached until a new future path is taken
    expect(history[1].props).toEqual({
      component: 'User',
      data: 'user.json'
    });
  });

  it("should go forward when pushing an entry we went back from", function() {
    var history = new Fresh.RouterHistory();
    history.push({
      component: 'List',
      data: 'users.json'
    });
    history.push({
      component: 'User',
      data: 'user.json'
    });
    history.push({
      component: 'List',
      data: 'users.json'
    });
    var transition = history.push({
      component: 'User',
      data: 'user.json'
    });
    expect(transition).toEqual(history.transitionTypes.FORWARD);
    expect(history.index).toEqual(1);
    expect(history.length).toEqual(2);
    // Past entry is cached
    expect(history[0].props).toEqual({
      component: 'List',
      data: 'users.json'
    });
    expect(history[1].props).toEqual({
      component: 'User',
      data: 'user.json'
    });
  });
});
