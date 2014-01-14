'use strict';

var _ = require('lodash');
var d3 = require('d3');
var chart = require('../src/chart');
var colorbrewer = require('./colorbrewer');
var dataSource = require('./data');
var utils = require('./utils');

// Store the complete dataset of the chart.
//
var data = null;

// Store the displayed dataset of the chart.
//
var filteredData = null;

// Current display options.
var options = {hourCount: 24, dayHours: [0, 24]};
options.weekDays = document.getElementById('week-days').value.split(',');

// Initial color palette to use.
//
var INIT_PALETTE = 'RdBu';

// Create the color scale from the palette.
//
var colorScale = d3.scale.quantize().domain([0, 1])
                   .range(colorbrewer[INIT_PALETTE][9]);

// Create the chart in an SVG element.
//
var chart = d3.select('#vis')
              .append('svg')
              .chart('BubbleMatrix');

// Set up the rows.
//
chart.rows(function (d) { return d.days; })
     .rowKey(function (d) { return d.key; })
     .rowHeader(function (d) { return dataSource.DayNames[d.key]; })
     .rowData(function (d) { return d.data; });

// Set up the colums.
//
chart.columns(function (d) {
    return d3.range(d.dayHours[0], d.dayHours[1]);
})
     .colKey(function (d) { return d; })
     .colHeader(utils.hourName);

// Set up the bubbles.
//
chart.size(function (d) { return d.volume; })
     .color(function (d) { return d.positivity; })
     .colorScale(utils.nullableScale('#ddd', colorScale));

// The margin is the space allocated for row headers at the left. We can
// listen to its change and move the chart so that bubble threads are
// aligned with our paragraphs. `this` here refers to the chart, and
// `this.base` is a d3 selection on the SVG element, automatically
// provided by the chart.
//
chart.on('margin', function(value) {
    this.base.style('margin-left', '-' + value + 'px');
});

// We demonstrate here the ability to change some inner elements of the
// chart easily. Here, we highlight the daytime hours by setting a
// light color to other headers. Returning `null` makes the header
// get the color defined by CSS.
//
chart.layer('col-header').on('enter', function () {
    this.classed('night', function (d) {
        return !(d > 6 && d < 20);
    });
});

// Helpers.
//
function redraw() {
    chart.draw(filteredData);
}

function refilter() {
    filteredData = dataSource.filter(data, options);
    redraw();
}

function rebuild() {
    data = dataSource.generate();
    refilter();
}

function resize() {
    var width = window.innerWidth * 0.70;
    chart.width(width);
    chart.height(width * 0.3);
}

function onResize() {
    resize();
    redraw();
}

window.addEventListener('resize', _.debounce(onResize, 100));
document.getElementById('refresh').addEventListener('click', rebuild);

document.getElementById('day-hours')
    .addEventListener('change', function () {
        options.dayHours = document.getElementById('day-hours').value.split(',');
        options.dayHours[0] = +options.dayHours[0];
        options.dayHours[1] = +options.dayHours[1];
        refilter();
    });

document.getElementById('week-days')
    .addEventListener("change", function() {
        options.weekDays = document.getElementById('week-days').value.split(',');
        refilter();
});

var paletteSelect = document.getElementById('color-palette');

for (var pl in colorbrewer) {
    if (typeof colorbrewer[pl][9] === 'undefined')
        continue;
    var el = document.createElement('option');
    el.text = pl;
    if (pl === INIT_PALETTE)
        el.setAttribute('selected', 'selected');
    paletteSelect.appendChild(el);
}

paletteSelect.addEventListener('change', function () {
    var palette = paletteSelect.value;
    colorScale.range(colorbrewer[palette][9]);
    redraw();
});

resize();
rebuild();
