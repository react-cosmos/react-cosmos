(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals
    root.Play = factory();
  }
}(this, function() {
  var extend = function(obj) {
    var sources = Array.prototype.slice.call(arguments, 1),
        source,
        i;
    for (i = 0; i < sources.length; i++) {
      source = sources[i];
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };
  var now = function() {
    return new Date().getTime();
  };
  var Play = function(id, options) {
    /**
     * Performs an abstract transition for a fixed amount of time, regardless
     * of the frame rate of the page (frame skipping.) Calls an onFrame
     * callback with a 0-to-1 float ratio (representing the progress of the
     * transition) as often as the browser can perform.
     *
     * A custom transition easing can be set using the "easing" option,
     * otherwise it defaults to linear.
     *
     * WARNING: This lib doesn't have tests!
     * TODO: Add polyfill for requestAnimationFrame
     */
    this.id = id;
    this.options = extend({}, this.defaults, options || {});
    // Validate that we have a callback function (nothing to do otherwise)
    if (typeof(this.options.onFrame) != 'function') {
      throw new Error('Play instance is missing an onFrame callback');
    }
    // A custom easing function is optional, linear is the default
    if (this.options.easing &&
        typeof(this.options.easing) != 'function') {
      throw new Error('Play easing must be a Function');
    }
    this.init();
  };
  extend(Play, {
    // Global stack for keeping references to instances
    stack: [],
    // Each new instance receives a unique numeric id, incremented one by one
    lastId: 0,

    start: function(options) {
      if (options.id === undefined) {
        options.id = ++this.lastId;
      }
      var instance = this.getInstanceById(options.id);
      // You can run two transitions at the same type for the same id
      if (instance) {
        this.end(instance);
      }
      instance = new Play(options.id, options);
      // Ignore instance if it has invalid time params
      if (instance.t2 < instance.t1) {
        return;
      }
      var time = now();
      // Run the onFrame callback on the instance for the first time, manually
      // (in order for it to have synchronous effect, and have its initial
      // state applied immediately)
      instance.onFrame(time);
      // No need to push an instance into the animation loop if its finishing
      // time isn't in the future
      if (instance.t2 > time) {
        Play.push(instance);
      }
      return instance;
    },
    end: function(instance) {
      /**
       * Remove an instance from the animation loop and call its callback with
       * fake finish time, thus rendering its last frame before removing it
       */
      instance.onFrame(instance.t2);
      this.stop(instance);
    },
    stop: function(instance) {
      /**
       * Remove an instance from the animaton loop
       */
      var positionInStack = this.stack.indexOf(instance);
      if (positionInStack !== -1) {
        this.stack.splice(positionInStack, 1);
      }
    },
    push: function(instance) {
      /**
       * Push an instance into the animation loop
       */
      // Since the entire Play animation loop shuts down when the last instance
      // standing ends its execution, we must make sure it's running whenever
      // pushing a new one
      if (!this.interval) {
        this.startAnimationLoop();
      }
      this.stack.push(instance);
    },
    getInstanceById: function(id) {
      for (var i = 0; i < this.stack.length; i++) {
        if (this.stack[i].id == id) {
          return this.stack[i];
        }
      }
    },
    startAnimationLoop: function() {
      // Don't create new interval if one is already running
      if (this.interval) {
        return;
      }
      var _this = this;
      // Set interval with a 13-millisecond refresh time - socially acceptable :)
      this.interval = setInterval(function() {
        _this.onFrame(now());
      }, 13);
    },
    stopAnimationLoop: function() {
      clearInterval(this.interval);
      this.interval = null;
    },
    onFrame: function(time, deleteIndex) {
      /**
       * Called with every animation loop. Goes through all active instances
       * and runs their own onFrame callback individually.
       *
       * The deleteIndex param is used when finding an expired instance that we
       * want to remove while looping through all the active instances.
       * Removing an element from a list alters the indices from that list, so
       * we break the loop and resume with the next element in a recursive
       * onFrame call
       */
      if (deleteIndex !== undefined) {
        this.stack.splice(deleteIndex, 1);
        // Clear the entire running running loop if this was the last instance
        // running (it will be restarted automatically when a new instance is
        // created)
        if (!this.stack.length) {
          this.stopAnimationLoop();
        }
      }
      var instance;
      for (var i = deleteIndex || 0; i < this.stack.length; i++) {
        instance = this.stack[i];
        instance.onFrame(time);
        // Instance has expired if its finishing time is not in the future
        if (instance.t2 <= time) {
          this.onFrame(time, i);
        }
      }
    },
    prototype: {
      // Constructor options will extend these
      defaults: {
        // The default duration is none (instant)
        time: 0,
        // Start the transition at a given ratio directly; useful when trying to
        // resume a previous transition or to start a new one from the same
        // position a previous transition was stopped at
        ratio: 0
      },
      init: function() {
        this.t1 = now();
        this.t2 = this.t1 + (this.options.time * 1000);
        // If a starting ratio is specified along with the constructor options,
        // we need to shift this instance's entire timeframe along the timeline,
        // in order to continue from that given ratio (in other words start a
        // transition mid-way)
        if (this.options.ratio) {
          var offset = (this.t2 - this.t1) * this.options.ratio;
          this.t1 -= offset;
          this.t2 -= offset;
        }
      },
      onFrame: function(time) {
        /**
         * Called every animation loop as long as this instance is active and
         * within its timeframe.
         *
         * Receives the current timestamp as a parameter from the Play factory
         * in order to avoid having to fetch it for each instance individually
         */
        var ratio;
        // The starting time should always be smaller than the ending one, but
        // we must avoid division by 0
        if (this.t2 != this.t1) {
          // Make sure the ratio doesn't exceed 1, which is the end value of a
          // transition (max value)
          ratio = Math.min((time - this.t1) / (this.t2 - this.t1), 1);
        } else {
          ratio = 1;
        }
        // Apply user-defined transition formula, if specified. Not having one
        // simply renders the transition linear
        if (this.options.easing) {
          ratio = this.options.easing.call(this, ratio);
        }
        // Call user-defined callback with the current progress of the
        // transition as the only parameter
        this.options.onFrame.call(this, ratio);
      }
    }
  });
  return Play;
}));
