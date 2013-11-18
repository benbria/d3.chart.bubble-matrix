# Roadmap

  * add support for slanted headers (especially for columns) while keeping
    simplicity of implementation;
  * add a proper test suite;
  * try to improve performance with a lot of bubbles (allowing disabling
    move animations, maybe? or disable by ourselves when we see that
    columns or rows did not change, only bubble data);
  * minify the CSS? useful or not, given most people minify themselves?
  * make sure AMD is working (and add a test for it);
  * add the ability to set the width without counting the headers;
  * OR, provide a function to know the margin size beforehand;
  * add the ability to filter columns automatically based on size?
  * OR, a better way to implement "responsivness" for this chart;
  * add the ability to align row headers to the left?
  * solve the animation issues, notably do not use 'enter:transition' events
    as those are overriden by the next 'draw' call.
  * auto-set the chart height, mayhaps by adding a new property maxHeight?
  * put the scales and such in the public API since it can be used by
    user-defined layers.

