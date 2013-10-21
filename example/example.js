(function() {
    var data = null;

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

    var chart = d3.select("#vis")
        .append("svg")
        .chart("BubbleMatrix")
        .rowKey(function (d) { return d.key; })
        .rowHeader(function (d) { return DayNames[d.name]; })
        .rowData(function (d) { return d.data; })
        .colHeader(function (i) { return HOUR_NAMES[i]; })
        .radius(function (d) { return d.volume; })
        .color(function (d) { return d.positivity; })
        .colorScale(d3.scale.quantize()
            .domain([0,1])
            .range(colorbrewer.Spectral[9]));

    var jx = 0;
    function genRndRow(key) {
        row = [];
        for (var i = 0; i < 24; ++i) {
            v = Math.random()*3/4+0.25;
            //v = ((i+jx)%24)/24;
            row.push({volume: v, positivity: Math.random()});
        }
        ++jx;
        return {key: key, data: row};
    }

    function genData() {
        var data = [
            genRndRow('MON'),
            genRndRow('TUE'),
            genRndRow('WED'),
            genRndRow('THU'),
            genRndRow('FRI'),
            genRndRow('SAT'),
            genRndRow('SUN')
        ];
        return data;
    }

    function onResize() {
        chart.width(window.innerWidth-50);
        chart.height(window.innerHeight-50);
        chart.draw(data);
    }

    function onClick() {
        data = genData();
        chart.draw(data);
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("click", onClick);

    data = genData();
    onResize();

}());
