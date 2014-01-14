'use strict';

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
};

// Randomness modifiers in order to obtain a "real-looking" chart.
//
var HOUR_VOLUMES = [0, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.2,
                    0.7, 0.8, 0.6, 0.5, 0.9, 0.8, 0.7, 0.5,
                    0.3, 0.4, 0.5, 0.7, 0.9, 0.8, 0.6, 0.3,];


function genRndRow(key) {
    var row = [];
    for (var i = 0; i < 24; ++i) {
        var v = Math.random() * HOUR_VOLUMES[i] * 1.5;
        var p = Math.random();

        if (v < 0.1) {
            v = 0.1;
            p = null;
        }
        if (v > 1) v = 1;
        row.push({volume: v, positivity: p});
    }
    return {key: key, data: row};
}

function genData() {
    var data = [];
    for (var key in DayNames) {
        data.push(genRndRow(key));
    }
    return {days: data, dayHours: [0, 24]};
}

function filterRow(row, options) {
    var data = [];
    for (var i = options.dayHours[0]; i < options.dayHours[1]; ++i) {
        data.push(row.data[i]);
    }
    return {key: row.key, data: data};
}

function filterData(data, options) {
    var filteredData = {days: [], dayHours: options.dayHours};
    for (var i = 0; i < data.days.length; ++i) {
        var day = data.days[i];
        if (options.weekDays.indexOf(day.key) >= 0) {
            filteredData.days.push(filterRow(day, options));
        }
    }
    return filteredData;
}

exports.DayNames = DayNames;
exports.generate = genData;
exports.filter = filterData;
