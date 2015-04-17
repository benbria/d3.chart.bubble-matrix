'use strict';

var TICK_HEIGHT = 1;
var layer = {events: {}, modes: ['mobile', 'tablet', 'web']};

layer.dataBind = function (data) {
    var chart = this.chart();
    return this.selectAll('g.thread').data(data.rows, chart.rowKey());
};

layer.insert = function () {
    var chart = this.chart();
    var g = this.append('g').classed('thread', true).attr('opacity', 0);
    g.append('path');
    return g;
};

function transformThread(sel, chart) {
    sel.attr('transform', function (d, i) {
        return 'translate(0,' + (chart.yScale(i)) + ')';
    });
}

layer.events['enter'] = function () {
    this.call(transformThread, this.chart());
};

layer.events['merge'] = function () {
    var chart = this.chart();
    var range = chart.xScale.range();
    var left = chart.leftMargin;
    var tickHeight = TICK_HEIGHT * chart.maxRadius;
    var path = 'M ' + left + ' -' + (tickHeight / 2) + ' v ' + tickHeight;
    path += ' M ' + left + ' 0 H ' + range[range.length - 1];
    this.select('path').attr('d', path);
};

layer.events['enter:transition'] = function () {
    this.duration(this.chart().duration());
    this.attr('opacity', 1);
};

layer.events['update:transition'] = function () {
    var chart = this.chart();
    this.duration(chart.duration());
    this.call(transformThread, chart);
    this.attr('opacity', 1);
};

layer.events['exit:transition'] = function () {
    var chart = this.chart();
    this.duration(chart.duration());
    this.attr('opacity', 0).remove();
};

module.exports = layer;
