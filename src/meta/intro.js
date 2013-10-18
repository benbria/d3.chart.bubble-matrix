(function(mod) {
    // CommonJS, Node.js, browserify.
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = mod(require('d3'),
                             require('d3.chart'),
                             require('d3.chart.base'));
        return;
    }
    // AMD.
    if (typeof define === "function" && define.amd) {
        return define(['d3', 'd3.chart', 'd3.chart.base'], mod);
    }
    // Plain browser (no strict mode: `this === window`).
    this.d3ChartBubbleMatrix = mod(this.d3, this.d3Chart, this.d3ChartBase);
})(function(d3, d3Chart) {
  "use strict";
  var exports = {};
