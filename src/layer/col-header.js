'use strict';

var layer = {events: {}};

layer.dataBind = function (data) {
    var chart = this.chart();
    return this.selectAll('text').data(data.cols, chart.colKey());
};

layer.insert = function () {
    var chart = this.chart();
    return this.append('text').attr('opacity', 0);
};

function transformCol(sel, chart) {
    var bottom = chart.bottomMargin_;
    var slanted = chart.slanted_;
    sel.attr('transform', function (d, i) {
        var result;
        result = 'translate(' + (chart.xScale()(i)) + ',' + bottom + ')';
        if (slanted) {
            result += 'rotate(45)';
        }
        return result;
    });
}

layer.events['enter'] = function () {
    this.call(transformCol, this.chart());
};

layer.events['merge'] = function () {
    var chart = this.chart();
    this.text(chart.colHeader_);
};

layer.events['enter:transition'] = function () {
    var chart = this.chart();
    this.duration(chart.duration_);
    this.attr('opacity', 1);
};

layer.events['update:transition'] = function () {
    var chart = this.chart();
    this.duration(chart.duration_);
    this.call(transformCol, chart);
};

layer.events['exit'] = function () {
    this.remove();
};

module.exports = layer;
