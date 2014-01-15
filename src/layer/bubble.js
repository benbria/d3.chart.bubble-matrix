'use strict';

var STROKE_WIDTH = 0.15;
var layer = {events: {}};

layer.dataBind = function (data) {
    var chart = this.chart();
    if (chart.colKey()) {
        chart._bubbleKey = function (d, i) {
            return chart.colKey()(data.cols[i], i);
        };
    } else {
        chart._bubbleKey = void 0;
    }
    return this.selectAll('g.row').data(data.rows, chart.rowKey());
};

layer.insert = function () {
    var chart;
    chart = this.chart();
    return this.append('g').classed('row', true);
};

var bubbleEnter = function (sel, chart) {
    this.attr('r', 0);
    this.attr('fill', function (d) {
        return chart.colorScale()(chart.color()(d));
    });
    this.attr('opacity', 0);
    return this.attr('cx', function (d, i) {
        return chart.xScale(i);
    });
};

var bubbleMerge = function (sel, chart) {
    return this.attr('stroke-width', STROKE_WIDTH * chart.maxRadius);
};

var bubbleExit = function (sel, chart) {
    return this.remove();
};

var bubbleMergeTransition = function (sel, chart) {
    this.duration(chart.duration());
    this.attr('opacity', 1);
    this.attr('cx', function (d, i) {
        return chart.xScale(i);
    });
    this.attr('r', function (d) {
        return chart.radiusScale(chart.size()(d));
    });
    return this.attr('fill', function (d) {
        return chart.colorScale()(chart.color()(d));
    });
};

var transformRow = function (sel, chart) {
    return this.attr('transform', function (d, i) {
        return 'translate(0,' + (chart.yScale(i)) + ')';
    });
};

layer.events['enter'] = function () {
    var chart = this.chart();
    return this.call(transformRow, chart);
};

layer.events['merge'] = function () {
    var key = null;
    var chart = this.chart();
    if (chart._bubbleKey) {
        key = function () {
            if (this instanceof Array) {
                return chart._bubbleKey.apply(this, arguments);
            }
            return this.__key__;
        };
    }
    var bubbles = this.selectAll('circle').data(chart.rowData(), key);
    bubbles.enter().append('circle').call(bubbleEnter, chart);
    bubbles.exit().call(bubbleExit, chart);
    bubbles.call(bubbleMerge, chart);
    if (key !== null) {
        bubbles.each(function (d, i) {
            this.__key__ = chart._bubbleKey(d, i);
        });
    }
    return bubbles.transition().call(bubbleMergeTransition, chart);
};

layer.events['update:transition'] = function () {
    var chart;
    chart = this.chart();
    this.duration(chart.duration());
    return this.call(transformRow, chart);
};

layer.events['exit'] = function () {
    return this.remove();
};

module.exports = layer;
