(function() {

    // Enumerate week days.
    //
    var DayNames = {
        MON: 'Monday',
        TUE: 'Tuesday',
        WED: 'Wednesday',
        THU: 'Thursday',
        FRI: 'Friday',
        SAT: 'Saturday',
        SUN: 'Sunday'
    }

    // Initial color palette to use.
    //
    var INIT_PALETTE = 'RdBu';

    // Randomness modifiers in order to obtain a real-looking chart.
    //
    var HOUR_VOLUMES = [0, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.2,
                        0.7, 0.8, 0.6, 0.5, 0.9, 0.8, 0.7, 0.5,
                        0.3, 0.4, 0.5, 0.7, 0.9, 0.8, 0.6, 0.3,]

    // Create the color scale from the palette.
    //
    var colorScale = d3.scale.quantize().domain([0,1])
                       .range(colorbrewer[INIT_PALETTE][9]);

    // Create and configure the chart.
    //
    var chart = d3.select("#vis")
        .append("svg")
        .chart("BubbleMatrix")
        .rows(function (d) { return d; })
        .rowKey(function (d) { return d.key; })
        .rowHeader(function (d) { return DayNames[d.key]; })
        .rowData(function (d) { return d.data; })
        .columns(function (d) { return d3.range(0, 24); })
        .colHeader(utils.hourName)
        .radius(function (d) { return d.volume; })
        .color(function (d) { return d.positivity; })
        .colorScale(utils.nullableScale('#ddd', colorScale))
        .on('margin', function(value) {
                this.base.style('margin-left', '-' + value + 'px');
            });

    // Demonstrate the ability to change some inner elements of the chart
    // quite easily. Here, we highlight the daytime hours by setting a
    // light color to other headers.
    //
    chart.layer('col-header').on('enter', function() {
        this.style('fill', function(d, i) {
            if (i > 6 && i < 20)
                return null;
            return '#ccc';
        });
    });

    var jx = 0;
    function genRndRow(key) {
        row = [];
        for (var i = 0; i < 24; ++i) {
            var v = Math.random() * HOUR_VOLUMES[i]*1.5;
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
        filteredData = filterData(data, options);
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

    window.addEventListener('resize', utils._debounce(onResize, 100));
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

    var paletteSelect = document.getElementById('color-palette');

    for (pl in colorbrewer) {
        if (colorbrewer[pl][9] == undefined)
            continue;
        var el = document.createElement('option');
        el.text = pl;
        if (pl === INIT_PALETTE)
            el.setAttribute('selected', 'selected');
        paletteSelect.appendChild(el);
    }

    paletteSelect.addEventListener("change", function() {
            var palette = paletteSelect.value;
            colorScale.range(colorbrewer[palette][9]);
            redraw();
    });

    data = genData();
    filteredData = filterData(data, options);
    onResize();

}());
