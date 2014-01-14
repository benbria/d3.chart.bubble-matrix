'use strict';

var util = require('./util');
var ld = require('lodash');
var d3 = require('d3');
var d3Chart = require('d3.chart');
var d3ChartBase = require('d3.chart.base');

var makeProp = util.makeProp;

var CHART_NAME = 'BubbleMatrix';
var CHART_ID = 'd3-chart-bubble-matrix';
var HZ_PADDING = 1.0;
var VT_PADDING = 1.0;
var RADIUS_PADDING = 0.1;
var DEFAULT_PALETTE = ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7',
                       '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'];

function defaultColorScale() {
    return d3.scale.quantize().domain([0, 1]).range(DEFAULT_PALETTE);
}

var layerMods = {
    'thread': require('./layer/thread.js'),
    'bubble': require('./layer/bubble.js'),
    'row-header': require('./layer/row-header.js'),
    'col-header': require('./layer/col-header.js')
};

var Chart = d3.chart('BaseChart').extend(CHART_NAME, {
    initialize: function () {
        this._loadDefaults();
        this.base.classed(CHART_ID, true);
        this._xScale = d3.scale.ordinal();
        this._yScale = d3.scale.ordinal();
        this._radiusScale = d3.scale.sqrt();
        this._leftMargin = 0;
        var layers = ['thread', 'bubble', 'row-header', 'col-header'];
        for (var i = 0; i < layers.length; ++i) {
            var layer = layers[i];
            var gr = this.base.append('g').classed(layer, true);
            this.layer(layer, gr, layerMods[layer]);
        }
    },

    _loadDefaults: function () {
        this.rows(function (d) { return d.rows; });
        this.rowHeader(function (d) { return d.name; });
        this.rowData(function (d) { return d.values; });
        this.columns(function (d) { return d.columns; });
        this.colHeader(function (d) { return d; });
        this.size(function (d) { return d[0]; });
        this.color(function (d) { return d[1]; });
        this.colorScale(defaultColorScale());
        this.slanted(false);
        this.duration(250);
    },

    transform: function (data) {
        this._ruler = util.textRuler(this.base);
        var rows = this._rows(data);
        var cols = this._columns(data);
        var left = this._updateLeftMargin(rows, this.width());
        var bottom = this._getMaxBottom(cols, this.height());
        var xDelta = (this.width() - left) / cols.length;
        var yDelta = (bottom - 0) / rows.length;
        this._xScale.domain(d3.range(0, cols.length));
        this._yScale.domain(d3.range(0, rows.length));
        var delta = Math.min(xDelta, yDelta);
        var right = left + delta * cols.length;
        bottom = delta * rows.length;
        this._xScale.rangePoints([left, right], HZ_PADDING);
        this._yScale.rangePoints([0, bottom], VT_PADDING);
        var padding = this._ruler.extentOfChar('W').height;
        this._bottomMargin = bottom + padding * 1.3;
        delta = (this._xScale(1)) - (this._xScale(0));
        this._maxRadius = delta * (1 - RADIUS_PADDING) / 2;
        this._radiusScale.range([0, this._maxRadius]);
        return {rows: rows, cols: cols};
    },

    _updateLeftMargin: function (data, width) {
        var self = this;
        var leftMargin = this._leftMargin;
        var maxWidth = function (r, d, i) {
            return Math.max(r, self._ruler(self._rowHeader(d, i)));
        };
        this._rowHeaderLeft = ld.reduce(data, maxWidth, 0);
        var padding = this._ruler.extentOfChar('W').width;
        this._rowHeaderLeft += padding;
        this._leftMargin = this._rowHeaderLeft + padding;
        if (this._leftMargin !== leftMargin) {
            this.trigger('margin', this._leftMargin);
        }
        return this._leftMargin + this._ruler.extentOfChar('W').width;
    },

    _getMaxBottom: function (data, height) {
        return height - 2 * this._ruler.extentOfChar('W').height;
    },

    rows: makeProp('_rows'),
    rowHeader: makeProp('_rowHeader'),
    rowKey: makeProp('_rowKey'),
    rowData: makeProp('_rowData'),
    columns: makeProp('_columns'),
    colHeader: makeProp('_colHeader'),
    colKey: makeProp('_colKey'),
    size: makeProp('_size'),
    color: makeProp('_color'),
    sizeDomain: makeProp('_sizeDomain', function (it) {
        return this._radiusScale.domain(it);
    }),
    colorScale: makeProp('_colorScale'),
    slanted: makeProp('_slanted'),
    duration: makeProp('_duration')
});

module.exports = Chart;
