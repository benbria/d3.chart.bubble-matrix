'use strict';

var CHART_DURATION = 0;
var DRAW_DELAY = 100;

var Selector = {
    COL_HEADER_TEXT:    'g.col-header text',
    ROW_HEADER_TEXT:    'g.row-header text',
    BUBBLE_ROW:         'g.bubble g.row',
    BUBBLE:             'circle'
};

function checkHeaders(svg, selector, dataset, headerFn, innerFn) {
    svg.selectAll(selector).each(function(d, i) {
        var s = d3.select(this);
        s.text().should.equal(innerFn(headerFn(dataset)[i]));
    });
}

function checkBubbles(svg, chart, dataset) {
    var colorScale = chart.colorScale();
    var radiusScale = chart.radiusScale_;
    svg.selectAll(Selector.BUBBLE_ROW).each(function(rd, ri) {
        var row = dataset.rows[ri];
        var bubbles = d3.select(this).selectAll(Selector.BUBBLE);
        bubbles.each(function(bd, bi) {
            var bubble = d3.select(this);
            (+bubble.attr('r')).should.be.
                closeTo(radiusScale(row.values[bi][0]), 0.01);
            bubble.attr('fill').should.equal(colorScale(row.values[bi][1]));
        });
    });
}

function getRows(dataset) { return dataset.rows; }
function getColumns(dataset) { return dataset.columns; }
function getName(datum) { return datum.name; }
function identity(datum) { return datum; }

describe('chart', function() {
    var svg, chart;

    function init() {
        svg = d3.select('body').append('svg');
        chart = svg.chart('BubbleMatrix')
                   .width(200).height(200).duration(CHART_DURATION);
    }

    // The added delay is necessary to obtain "consistent" success, at
    // least on Chrome. Without, it sometimes fails, maybe because the browser
    // it not completely ready. Firefox seems not to have the problem at all.
    // The delay of 500 is completely arbitrary.
    //
    // TODO(undashes): report this issue on Karma tracker?
    //
    before(function(cb) {
        setTimeout(function() {
            if (document.readyState === 'complete') {
                init();
                cb();
            }
            window.addEventListener('load', function() {
                init();
                cb();
            }, false);
        }, 500);
    });

    after(function() {
        svg.remove();
    });

    describe('full data', function() {
        before(function(cb) {
            chart.draw(window.testData.full);
            setTimeout(cb, DRAW_DELAY);
        });

        it('should display proper rows', function() {
            checkHeaders(svg, Selector.ROW_HEADER_TEXT,
                         window.testData.full,
                         getRows, getName);
        });

        it('should display proper columns', function() {
            checkHeaders(svg, Selector.COL_HEADER_TEXT,
                         window.testData.full,
                         getColumns, identity);
        });

        it('should display proper bubbles', function() {
            checkBubbles(svg, chart, window.testData.full);
        });
    });

    describe('three-rows data', function() {
        before(function(cb) {
            chart.draw(window.testData.threeRows);
            setTimeout(cb, DRAW_DELAY);
        });

        // TODO(jeanlauliac): test that the row and column keys are tracked.
        it('should update rows', function() {
            checkHeaders(svg, Selector.ROW_HEADER_TEXT,
                         window.testData.threeRows,
                         getRows, getName);
        });
    });

    describe('four-cols data', function() {
        before(function(cb) {
            chart.draw(window.testData.fourCols);
            setTimeout(cb, DRAW_DELAY);
        });

        it('should update columns', function() {
            checkHeaders(svg, Selector.COL_HEADER_TEXT,
                         window.testData.fourCols,
                         getColumns, identity);
        });
    });
});
