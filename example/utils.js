'use strict';

// Build a small hour name based on it's index from 0 to 24.
// Eg. '2p', meaning 2 P.M. Note that 12p is noon, 12a midnight.
//
exports.hourName = function (i) {
    var letter = 'a';
    if (i >= 12)
        letter = 'p';
    i = i % 12;
    if (i === 0)
        i = 12;
    return i + letter;
};

// Create a 'nullable' scale, just like d3.js scales but allowing for
// `null` value to be passed as argument. `v` is the value to be returned
// when the value is `null`; call `fn` otherwise.
//
// You access the inner function/scale subsequently by using the `inner`
// function.
// Eg. `nullableScale(0, d3.scale.linear()).inner().domain([0,1])`
//
exports.nullableScale = function (v, fn) {
    var innerFn = fn;
    var result = function (c) {
        if (c === null || typeof c === 'undefined')
            return v;
        return innerFn(c);
    };
    result.inner = function (fn) {
        if (typeof fn === 'undefined')
            return innerFn;
        innerFn = fn;
    };
    return result;
};
