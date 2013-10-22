(function() {

    var DayNames = {
        MON: 'Monday',
        TUE: 'Tuesday',
        WED: 'Wednesday',
        THU: 'Thursday',
        FRI: 'Friday',
        SAT: 'Saturday',
        SUN: 'Sunday'
    }

    var HOUR_NAMES = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a',
                      '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p',
                      '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];

    var HOUR_VOLUMES = [0, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.2,
                        0.7, 0.8, 0.6, 0.5, 0.9, 0.8, 0.7, 0.5,
                        0.3, 0.4, 0.5, 0.7, 0.9, 0.8, 0.6, 0.3,]

    function nullableScale(v, fn) {
        var innerFn = fn;
        var result = function(c) {
            if (c == null)
                return v;
            return innerFn(c);
        }
        result.inner = function(fn) {
            if (fn == null)
                return innerFn;
            innerFn = fn;
        }
        return result;
    }

    var chart = d3.select("#vis")
        .append("svg")
        .chart("BubbleMatrix")
        .rowKey(function (d) { return d.key; })
        .rowHeader(function (d) { return DayNames[d.key]; })
        .rowData(function (d) { return d.data; })
        .colHeader(function (i) { return HOUR_NAMES[i]; })
        .radius(function (d) { return d.volume; })
        .color(function (d) { return d.positivity; })
        .colorScale(nullableScale('#ddd', d3.scale.quantize()
            .domain([0,1])
            .range(colorbrewer.RdYlBu[9])))
        .on('margin', function(value) {
                this.base.style('margin-left', '-' + value + 'px');
            });

    var jx = 0;
    function genRndRow(key) {
        row = [];
        for (var i = 0; i < 24; ++i) {
            var v = Math.random()*0.2 + HOUR_VOLUMES[i];
            var p = Math.random();

            if (v < 0.1) {
                v = 0.1
                p = null
            }
            if (v > 1) v = 1;
            //v = ((i+jx)%24)/24;
            row.push({volume: v, positivity: p});
        }
        ++jx;
        return {key: key, data: row};
    }

    function genData() {
        var data = [];
        for (var key in DayNames) {
            data.push(genRndRow(key));
        }
        return data;
    }

    function filterRow(row, options) {
        var data = [];
        for (var i = 0; i < options.hourCount; ++i) {
            data.push(row.data[i]);
        }
        return {key: row.key, data: data};
    }

    function filterData(data, options) {
        var filteredData = []
        for (var i = 0; i < data.length; ++i) {
            if (options.weekDays.indexOf(data[i].key) >= 0) {
                filteredData.push(filterRow(data[i], options));
            }
        }
        return filteredData;
    }



    var data = null;
    var filteredData = null;
    var options = {hourCount: 24};
    options.weekDays = document.getElementById('week-days').value.split(',');

    function redraw() {
        chart.draw(filteredData);
    }

    function refilter() {
        console.log('DATA', data);
        filteredData = filterData(data, options);
        console.log('FILTERED', filteredData);
        redraw();
    }

    function rebuild() {
        data = genData();
        refilter();
    }

    function onResize() {
        width = window.innerWidth*0.70
        chart.width(width);
        chart.height(width*0.3);
        chart.draw(filteredData);
    }

    window.addEventListener('resize', onResize);
    document.getElementById('refresh').addEventListener("click", rebuild);

    document.getElementById('hour-count')
        .addEventListener("change", function() {
            options.hourCount = document.getElementById('hour-count').value;
            refilter();
    });

    document.getElementById('week-days')
        .addEventListener("change", function() {
            options.weekDays = document.getElementById('week-days').value.split(',');
            refilter();
    });

    var paletteSelect = document.getElementById('palette');

    for (pl in colorbrewer) {
        if (colorbrewer[pl][9] == undefined)
            continue;
        var el = document.createElement('option');
        el.text = pl;
        paletteSelect.appendChild(el);
    }
    paletteSelect.value = 'RdYlBu';

    paletteSelect.addEventListener("change", function() {
            var palette = paletteSelect.value;
            chart.colorScale().inner().range(colorbrewer[palette][9]);
            redraw();
    });

    data = genData();
    filteredData = filterData(data, options);
    onResize();

}());
