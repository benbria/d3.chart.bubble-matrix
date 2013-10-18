(function(mod) {
    // CommonJS, Node.js, browserify.
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = mod(require('d3'), require('d3.chart'));
        return;
    }
    // AMD.
    if (typeof define === "function" && define.amd) {
        return define(["d3", "d3.chart"], mod);
    }
    // Plain browser (no strict mode: `this === window`).
    this.bubbleMatrix = mod(this.d3, this.d3.chart);
})(function(d3, d3Chart) {
  "use strict";
  var exports = {};
