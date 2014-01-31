'use strict';

var d3 = require('d3');
var chart = require('d3.chart.bubble-matrix');

var chart = d3.select('#vis').append('svg')
              .chart('BubbleMatrix')
              .width(400).height(200);

chart.draw(require('./data'));
