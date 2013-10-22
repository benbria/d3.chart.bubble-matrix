(function() {
    utils = {}

    // Borrowed from Underscore.js 1.5.2
    //     http://underscorejs.org
    //     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
    //     Underscore may be freely distributed under the MIT license.
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    utils._debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        return function() {
          context = this;
          args = arguments;
          timestamp = new Date();
          var later = function() {
            var last = (new Date()) - timestamp;
            if (last < wait) {
              timeout = setTimeout(later, wait - last);
            } else {
              timeout = null;
              if (!immediate) { result = func.apply(context, args); }
            }
          };
          var callNow = immediate && !timeout;
          if (!timeout) {
            timeout = setTimeout(later, wait);
          }
          if (callNow) { result = func.apply(context, args); }
          return result;
        };
    }

    // Build a small hour name based on it's index from 0 to 24.
    // Eg. '2p', meaning 2 P.M. Note that 12p is noon, 12a midnight.
    //
    utils.hourName = function(i) {
        var letter = 'a';
        if (i >= 12)
            letter = 'p';
        i = i % 12;
        if (i === 0)
            i = 12;
        return i + letter;
    }

    // Create a 'nullable' scale, just like d3.js scales but allowing for
    // `null` value to be passed as argument. `v` is the value to be returned
    // when the value is `null`; call `fn` otherwise.
    //
    // You access the inner function/scale subsequently by using the `inner`
    // function.
    // Eg. `nullableScale(0, d3.scale.linear()).inner().domain([0,1])`
    //
    utils.nullableScale = function(v, fn) {
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

}());
