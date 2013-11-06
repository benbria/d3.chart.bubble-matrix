'use strict';

function checkHeaders(selector, dataset, headerFn, innerFn) {
    d3.selectAll(selector).each(function(d, i) {
        var s = d3.select(this);
        s.text().should.equal(innerFn(headerFn(dataset)[i]));
    });
}

function checkHeadersDelayed(selector, dataset, headerFn, innerFn, cb) {
    setTimeout(function() {
        checkHeaders(selector, dataset, headerFn, innerFn);
        cb();
    }, 25);
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
                   .width(200).height(200).duration(0);
    }

    // The added delay is necessary to obtain "consistent" success, at
    // least on Chrome. Without, it sometime fails, maybe because the browser
    // it not completely ready.
    //
    // TODO(undashes): report this issue on Karma tracker?
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

    describe('row headers', function() {
        it('should show up', function(cb) {
            chart.draw(window.testData.full);
            checkHeadersDelayed('g.row-header text', window.testData.full,
                                getRows, getName, cb);
        });
        it('should update', function(cb) {
            chart.draw(window.testData.threeRows);
            checkHeadersDelayed('g.row-header text', window.testData.threeRows,
                                getRows, getName, cb);
        });
    });

    describe('column headers', function() {
        it('should show up', function(cb) {
            chart.draw(window.testData.full);
            checkHeadersDelayed('g.col-header text', window.testData.full,
                                getColumns, identity, cb);
        });
        it('should update', function(cb) {
            chart.draw(window.testData.fourCols);
            checkHeadersDelayed('g.col-header text', window.testData.fourCols,
                                getColumns, identity, cb);
        });
    });
});
