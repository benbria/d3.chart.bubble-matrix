(function(mod) {
    // CommonJS, Node.js, browserify.
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = mod(require('d3'),
                             require('d3.chart'),
                             require('d3.chart.base'),
                             requure('lodash'));
        return;
    }
    // AMD.
    if (typeof define === "function" && define.amd) {
        return define(['d3', 'd3.chart', 'd3.chart.base', 'lodash'], mod);
    }
    // Plain browser (no strict mode: `this === window`).
    this.d3ChartBubbleMatrix = mod(this.d3, this.d3Chart,
                                   this.d3ChartBase, this._);
})(function(d3, d3Chart, d3ChartBase, ld) {
  "use strict";
  var exports = {};
