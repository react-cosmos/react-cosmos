Cosmos.Transitions = {
  translateRectPositionAndScale: function(rect, initialAnchor, targetAnchor, ratio) {
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
