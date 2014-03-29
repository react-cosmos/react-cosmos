Cosmos.transitions.Zoom = function(options) {
  // Do nothing on first Components, their container is visible by default
  if (options.transitionType == Cosmos.RouterHistory.transitionTypes.INITIAL) {
    return;
  }
  // The next container will always be inserted after of the previous in the
  // DOM tree, even when going backwards in history. We use z-index to place
  // them on top of eachother
  var $prev = $(options.prevContainer),
      $next = $(options.nextContainer),
      $parent = $next.parent(),
      rect = {
        width: $parent.width(),
        height: $parent.height()
      },
      originBounds = this._getOriginBoundsForTransition(options.transitionType, options.history),
      transitionAnchors = this._getTransitionAnchors(rect, originBounds, options.transitionType);
  // Previous containers need to be on front when going back, to simulate the
  // same visual hierarchy from the inverse forward transition
  if (options.transitionType == Cosmos.RouterHistory.transitionTypes.BACK) {
    $prev.css('z-index', 2);
  }
  // End any currently running transitions (this will also call their
  // callback one more time with max ratio [1], ensuring previous DOM
  // containers are removed when adding new ones)
  // The previous Component container will be removed at the end of the
  // transition (React GC should take over)
  Play.start({id: this, time: 0.5, onFrame: function(ratio) {
    var translatedPositionAndScale =
      this._getPositionAndScaleInTransition(
          rect,
          transitionAnchors,
          options.transitionType,
          ratio);
    $prev.css(translatedPositionAndScale.prev);
    $next.css(translatedPositionAndScale.next);
    if (options.transitionType == Cosmos.RouterHistory.transitionTypes.BACK) {
      $prev.css('opacity', 1 - ratio);
      $next.css('opacity', 1);
    } else {
      $prev.css('opacity', 1);
      $next.css('opacity', ratio);
    }
    if (ratio == 1) {
      // TODO: Make this a complete callback from the Router
      React.unmountComponentAtNode(options.prevContainer);
      $prev.remove();
    }
  }.bind(this)});
};
Cosmos.transitions.Zoom.prototype = {
  _getOriginBoundsForTransition: function(transitionType, history) {
    var historyIndex =
      transitionType == Cosmos.RouterHistory.transitionTypes.BACK ?
      history.index + 1 :
      history.index;
    return history[historyIndex].originBounds;
  },
  _getTransitionAnchors: function(rect, originBounds) {
    var deflatedScale = originBounds.width / rect.width,
        inflatedScale = 1 / deflatedScale;
    return {
      fullScreen: {
        scale: 1,
        x: 0,
        y: 0
      },
      awayFromScreen: {
        scale: deflatedScale,
        x: -originBounds.x,
        y: -originBounds.y
      },
      inFrontOfScreen: {
        scale: inflatedScale,
        x: originBounds.x,
        y: originBounds.y
      }
    };
  },
  _getPositionAndScaleInTransition: function(rect,
                                             transitionAnchors,
                                             transitionType,
                                             ratio) {
    if (transitionType == Cosmos.RouterHistory.transitionTypes.BACK) {
      return {
        prev: this._translateRectPositionAndScale(
          rect,
          transitionAnchors.awayFromScreen,
          transitionAnchors.fullScreen,
          1 - ratio),
        next: this._translateRectPositionAndScale(
          rect,
          transitionAnchors.fullScreen,
          transitionAnchors.inFrontOfScreen,
          1 - ratio)
      };
    } else {
      return {
        prev: this._translateRectPositionAndScale(
          rect,
          transitionAnchors.fullScreen,
          transitionAnchors.inFrontOfScreen,
          ratio),
        next: this._translateRectPositionAndScale(
          rect,
          transitionAnchors.awayFromScreen,
          transitionAnchors.fullScreen,
          ratio)
      };
    }
  },
  _translateRectPositionAndScale: function(rect, initialAnchor, targetAnchor, ratio) {
    /**
     * Function used for achieving a zoom in or out effect on a DOM element
     * through the CSS3 `transform` property. Given an rectangle with an
     * initial and a target anchor (each with a scale factor and an anchor
     * point to align the top-left corner to, at each side of the animation),
     * plus a ratio between 0 and 1 that should represent a given place in time
     * in the middle of the running animation (one loop), the function will
     * return a corresponding scale number and x, y coordonates. They will be
     * applied using the scale() and translate() CSS transform functions. E.g.
     *
     *   var rect = {
     *     width: 200,
     *     height: 200
     *   };
     *   var initialAnchor = {
     *     scale: 1,
     *     x: 0,
     *     y: 0
     *   };
     *   // This will zoom in a way that if the initial rect was viewed through
     *   // a 200x200-sized viewport you could only see the bottom-right corner
     *   // of the rect at the end of the animation (when ratio would become 1)
     *   var targetAnchor = {
     *     scale: 2,
     *     x: 100,
     *     y: 100
     *   };
     *   translateRectPositionAndScale(rect, initialAnchor, targetAnchor, 0);
     *   // {scale: 1, x: 0, y: 0}
     *   translateRectPositionAndScale(rect, initialAnchor, targetAnchor, 0.5);
     *   // {scale: 1.5, x: -33.33, y: -33.33}
     *   translateRectPositionAndScale(rect, initialAnchor, targetAnchor, 1);
     *   // {scale: 2, x: -50, y: -50}
     */
    var relativeScale = targetAnchor.scale - initialAnchor.scale,
        currentScale = initialAnchor.scale + relativeScale * ratio,
        reversedScale = targetAnchor.scale / currentScale,
        relativeOffset = {
          x: targetAnchor.x - initialAnchor.x,
          y: targetAnchor.y - initialAnchor.y
        },
        currentOffset = {
          x: initialAnchor.x + relativeOffset.x * ratio,
          y: initialAnchor.y + relativeOffset.y * ratio
        };
    var newRect = {
      scale: currentScale,
      // Move top-left corner in the middle of the viewport
      x: rect.width / 2,
      y: rect.height / 2
    };
    // Move top-left corner in the top-left corner of the viewport (the
    // viewport size is the only absolute in this formula, thus we need to
    // constantly translate it to be relative to our current scale)
    newRect.x -= rect.width / 2 / currentScale;
    newRect.y -= rect.height / 2 / currentScale;
    // Apply position offset between target and initial anchor (since the scale
    // is different for any ratio we need to adapt the offset to it)
    newRect.x -= currentOffset.x * reversedScale;
    newRect.y -= currentOffset.y * reversedScale;
    return newRect;
  }
};
