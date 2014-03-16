var Cosmos = require('../build/cosmos.js');

describe("Cosmos.RouterHistory", function() {

  describe("translateRectPositionAndScale", function() {

    it("should zoom in to bottom-right corner", function() {
      var rect = {
         width: 200,
         height: 200
      };
      var initialAnchor = {
        scale: 1,
        x: 0,
        y: 0
      };
      // This will zoom in a way that if the initial rect was viewed through a
      // 200x200-sized viewport you could only see the bottom-right corner of
      // the rect at the end of the animation (when ratio would become 1)
      var targetAnchor = {
        scale: 2,
        x: 100,
        y: 100
      };
      expect(Cosmos.transitions.translateRectPositionAndScale(
        rect, initialAnchor, targetAnchor, 0)).toEqual({
          scale: 1, x: 0, y: 0});

      // This one's a bit tricky. Since the scale is in direct proportion to
      // the ratio the offsets are also calculated based on the scale at that
      // any given ratio (point in time)
      var translatedRect = Cosmos.transitions.translateRectPositionAndScale(
        rect, initialAnchor, targetAnchor, 0.5);
      expect(translatedRect.scale).toEqual(1.5);
      expect(parseFloat(translatedRect.x.toFixed(2))).toEqual(-33.33);
      expect(parseFloat(translatedRect.y.toFixed(2))).toEqual(-33.33);

      // It will only move to 50x50 because scaling it to 2x will already moves
      // it both top and left with -50px (since scaling starts from the center
      // of an element)
      expect(Cosmos.transitions.translateRectPositionAndScale(
        rect, initialAnchor, targetAnchor, 1)).toEqual({
          scale: 2, x: -50, y: -50});
    });

    it("should zoom in to top-left corner", function() {
      var rect = {
         width: 300,
         height: 300
      };
      var initialAnchor = {
        scale: 1,
        x: 0,
        y: 0
      };
      var targetAnchor = {
        scale: 3,
        x: 0,
        y: 0
      };
      expect(Cosmos.transitions.translateRectPositionAndScale(
        rect, initialAnchor, targetAnchor, 0)).toEqual({
          scale: 1, x: 0, y: 0});

      expect(Cosmos.transitions.translateRectPositionAndScale(
        rect, initialAnchor, targetAnchor, 0.5)).toEqual({
          scale: 2, x: 75, y: 75});

      expect(Cosmos.transitions.translateRectPositionAndScale(
        rect, initialAnchor, targetAnchor, 1)).toEqual({
          scale: 3, x: 100, y: 100});
    });

    it("should fly in to bottom center", function() {
      var rect = {
         width: 200,
         height: 200
      };
      var initialAnchor = {
        scale: 0.25,
        x: -75,
        y: -150
      };
      var targetAnchor = {
        scale: 1,
        x: 0,
        y: 0
      };
      // How y is calculated:
      // - rect becomes 50x50 because of scale 1/4
      // - diff between scaled rect bottom and initial rect bottom is
      // - 200/2-50/2=75
      // - 75 at 0.25 scale becomes 300
      expect(Cosmos.transitions.translateRectPositionAndScale(
        rect, initialAnchor, targetAnchor, 0)).toEqual({
          scale: 0.25, x: 0, y: 300});

      // x is always 0 because when a scaled object is centered so while the
      // input data is what the eye sees, the output is an offset for CSS
      expect(Cosmos.transitions.translateRectPositionAndScale(
        rect, initialAnchor, targetAnchor, 0.5)).toEqual({
          scale: 0.625, x: 0, y: 60});

      expect(Cosmos.transitions.translateRectPositionAndScale(
        rect, initialAnchor, targetAnchor, 1)).toEqual({
          scale: 1, x: 0, y: 0});
    });
  });
});
