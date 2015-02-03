'use strict';

var layer = {events: {}, modes: ['default']};

layer.dataBind = function (data) {
    var chart = this.chart();
    return this.selectAll('text').data(data.rows, chart.rowKey());
};

layer.insert = function () {
    var chart = this.chart();
    return this.append('text').attr('opacity', 0).attr('dy', '0.38em');
};

function transformRow(sel, chart) {
    var width = chart.width();
    var left = chart.rowHeaderLeft;
    return sel.attr('transform', function (d, i) {
        return 'translate(' + left + ',' + (chart.yScale(i)) + ')';
    });
}

layer.events['enter'] = function () {
    var chart = this.chart();
    this.call(transformRow, chart);
};

layer.events['merge'] = function () {
    var chart = this.chart();
    this.text(function () {
        return chart.rowHeader().apply(this, arguments);
    });
};

layer.events['enter:transition'] = function () {
    var chart = this.chart();
    this.duration(chart.duration());
    this.attr('opacity', 1);
};

layer.events['update:transition'] = function () {
    var chart = this.chart();
    this.duration(chart.duration());
    this.call(transformRow, chart);
    this.attr('opacity', 1);
};

layer.events['exit:transition'] = function () {
    var chart = this.chart();
    this.duration(chart.duration());
    this.attr('opacity', 0).remove();
};

module.exports = layer;
