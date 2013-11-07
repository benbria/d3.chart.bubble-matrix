'use strict';

var CHART_DURATION = 0;
var DRAW_DELAY = 25;

function checkHeaders(selector, dataset, headerFn, innerFn) {
    d3.selectAll(selector).each(function(d, i) {
        var s = d3.select(this);
        s.text().should.equal(innerFn(headerFn(dataset)[i]));
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
            if (document.readyState === "complete") {
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
            checkHeaders('g.row-header text', window.testData.full,
                         getRows, getName);
        });

        it('should display proper columns', function() {
            checkHeaders('g.col-header text', window.testData.full,
                         getColumns, identity);
        });


    });

    describe('three-rows data', function() {
        before(function(cb) {
            chart.draw(window.testData.threeRows);
            setTimeout(cb, DRAW_DELAY);
        });

        it('should update rows', function() {
            checkHeaders('g.row-header text', window.testData.threeRows,
                         getRows, getName);
        });
    });

    describe('four-cols data', function() {
        before(function(cb) {
            chart.draw(window.testData.fourCols);
            setTimeout(cb, DRAW_DELAY);
        });

        it('should update columns', function() {
            checkHeaders('g.col-header text', window.testData.fourCols,
                         getColumns, identity);
        });
    });
});
