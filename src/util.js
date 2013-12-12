'use strict';

// Make an function that can be used both as accessor and mutator.
//
exports.makeProp = function(name, fn) {
    return function(it) {
        if (!it) return this[name];
        this[name] = it;
        if (fn) fn.call(this, it);
        return this;
    };
};

// Execute a function `fn` on a ephemeral SVG text containing the specified
// String `str`.
//
exports.onTemporaryText(svgSel, str, fn) {
    var el = svgSel.append('text').text(str);
    var result = fn(el);
    el.remove();
    return result;
};

// Get the length of the String `str` in the SVG selection context `svgSel`.
//
exports.lengthOf(svgSel, str) {
    return onTemporaryText(svgSel, str, function(text) {
        return text.node().getComputedTextLength();
    });
}

// Get the extend of a character `chr` in the SVG selection context `svgSel`.
//
exports.extentOfChar(svgSel, chr) {
    if (chr.length < 1)
        throw new Error('char can\'t be empty');
    if (chr.length > 1)
        throw new Error('can get extent of a full string');
    return onTemporaryText(svgSel, chr, function(text) {
        return text.node().getExtentOfChar(0);
    });
}

// Create a text-measuring function in the specified SVG context. `svgSel` must
// a d3.js selection on an SVG root or child element. The measures are memoized
// so if the context change (eg. the `font-size` style), you shall recreate a
// text ruler.
//
// TODO @jeanlauliac: extract this as a separate module, as it can be helpful
// for other charts.
//
exports.textRuler = function(svgSel) {
    var ruler = ld.memoize(exports.lengthOf.bind(null, svgSel));
    ruler.extendOfChar = ld.memoize(exports.extentOfChar.bind(null, svgSel));
    ruler.onTemporaryText = exports.onTemporaryText.bind(null, svgSel);
    return ruler;
};

