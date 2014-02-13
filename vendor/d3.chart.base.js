/*! d3.chart.base - v0.4.0
 *  License: MIT Expat
 *  Date: 2013-10-15
 */
(function(d3) {

  // obtains element computed style
  // context is chart
  function _style(attr) {
    var style,
      element = this.base[0][0];
    if (window.getComputedStyle) {
      style = window.getComputedStyle(element);
    } else if (element.currentStyle) {
      style = element.currentStyle;
    }

    if (!attr) {
      return style;
    } else {
      return style[attr];
    }
  }

  // converts pixel values
  var _toNumFromPx = (function() {
    var rx = /px$/;
    return function(value) {
      if (rx.test(value)) {
        return +(value.replace(rx, ""));
      } else {
        return value;
      }
    };
  }());


  // helper attribute setter on chart base.
  // context is chart
  function _initAttr(internalName, d3Name, defaultValue) {
    var current = _toNumFromPx(_style.call(this, d3Name));

    if (current === null || current === 0 || current === "") {
      this[internalName] = defaultValue;
      this.base.style(d3Name, defaultValue);
    } else {
      this[internalName] = _toNumFromPx(_style.call(this, d3Name));
    }
  }

  // Borrowed from Underscore.js 1.5.2
  //     http://underscorejs.org
  //     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function _debounce(func, wait, immediate) {
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

  // go over existing modes and determine which we are in
  // returns true if a mode change occured, false otherwise.
  function _determineMode() {
    var oldMode = this._currentMode;
    this._currentMode = null;

    if ("modes" in this) {
      var result = false;
      for (var mode in this._modes) {
        result = this._modes[mode].call(this);
        if (result) {
          this._currentMode = mode;
          break;
        }
      }
    }
    return oldMode !== this._currentMode;
  }

  // takes care of removing/adding appropriate layers
  function _onModeChange() {

    var chart = this;

    for(var layerName in chart._layersArguments) {
      
      // is this chart in the current mode?
      var layerArgs = chart._layersArguments[layerName];
      
      // if this layer should not exist in the current mode
      // unlayer it and then save it so we can reattach it 
      // later.
      if (layerArgs.options.modes.indexOf(chart.mode()) === -1) {

        // is it showing?
        if (layerArgs.showing === true) {
          
          // nope? remove it.
          var removedLayer = chart.unlayer(layerName);
          removedLayer.style("display","none");
          chart._layersArguments[layerName].showing = false;
          chart._layersArguments[layerName].layer = removedLayer;
        }
      
      } else {

        // this layer is not showing, we need to add it
        if (chart._layersArguments[layerName].showing === false) {

          // if the layer has already been created, just re-add it
          if (chart._layersArguments[layerName].layer !== null) {
            oldLayer.call(chart, layerName, chart._layersArguments[layerName].layer);
            chart._layersArguments[layerName].layer.style("display","inline");
          } else {

            // this layer must not have been drawn in the initial rendering
            // but we do have the arguments, so render it using the
            // old layering.
            oldLayer.call(chart,
              chart._layersArguments[layerName].name,
              chart._layersArguments[layerName].selection,
              chart._layersArguments[layerName].options);
          }

          chart._layersArguments[layerName].showing = true;
        }
      }
    }
  }

  var BaseChart = d3.chart("BaseChart", {
    initialize: function() {

      var chart = this;
      // layer structures container - for layers that are
      // created on initialize but do not actually need to 
      // be rendered in the detected mode, we need to save the
      // actual arguments so that we can construct it later.
      this._layersArguments = {};

      // save mode functions
      this._modes = this.modes || {};
      delete this.modes;

      // store layers referenced per mode
      this._modeLayers = {};

      // determine current mode on initialization
      _determineMode.call(this);

      // setup some reasonable defaults
      chart._width  = _toNumFromPx(_style.call(chart, "width")) || 200;
      chart._height = _toNumFromPx(_style.call(chart, "height")) || 200;

      // make sure container height and width are set.
      _initAttr.call(this, "_width", "width", 200);
      _initAttr.call(this, "_height", "height", 200);

      // bind to winow resize end
      window.addEventListener("resize", _debounce(function() {

        // trigger generic resize event
        chart.trigger("resize");

        // don't overwrite % widths.
        if (!isNaN(chart._width)) {
          chart.width(_toNumFromPx(_style.call(chart, "width")) || 200, {
            noDraw : true
          });
        }
        if (!isNaN(chart._height)) {
          chart.height(_toNumFromPx(_style.call(chart, "height")) || 200, {
            noDraw: true
          });
        }
        
        // update current mode
        var changed = _determineMode.call(chart);
        if (changed) {
          chart.trigger("change:mode", this._currentMode);
        }

        // only redraw if there is data
        if (chart.data) {
          chart.draw(chart.data);
        }

      }, 150));

      window.addEventListener("orientationchange", function() {
        // redraw on device rotation
        chart.trigger("change:mode", this._currentMode);

        // only redraw if there is data
        if (chart.data) {
          chart.draw(chart.data);
        }
      }, false);

      // on mode change, update height and width, and redraw
      // the chart
      chart.on("change:mode", function() {

        // sort out current mode
        _onModeChange.call(chart);
       
      });
    },

    // returns current mode
    mode : function() {
      return this._currentMode;
    },

    recomputeMode: function() {
      var changed = _determineMode.call(this);
      if (changed) {
        this.trigger("change:mode", this._currentMode);
      }
      return changed;

    },

    width: function(newWidth, options) {
      options = options || {};
      if (arguments.length === 0) {
        if (this._width && !isNaN(+this._width)) {
          return this._width;
        } else {
          return _toNumFromPx(_style.call(this, "width"));
        }
      }

      var oldWidth = this._width;

      this._width = newWidth;

      // only if the width actually changed:
      if (this._width !== oldWidth) {

        // set higher container width
        this.base.style("width", isNaN(this._width) ?
          this._width :
          this._width + "px");

        // trigger a change event
        if (!options.silent) {
          this.trigger("change:width", this._width, oldWidth);
        }

        // redraw if we saved the data on the chart
        if (this.data && !options.noDraw) {
          this.draw(this.data);
        }
      }

      // always return the chart, for chaining magic.
      return this;
    },

    height: function(newHeight, options) {
      options = options || {};
      if (arguments.length === 0) {
        if (this._height && !isNaN(+this._height)) {
          return this._height;
        } else {
          return _toNumFromPx(_style.call(this, "height"));
        }
      }

      var oldHeight = this._height;

      this._height = newHeight;

      if (this._height !== oldHeight) {

        this.base.style("height", isNaN(this._height) ?
          this._height :
          this._height + "px");

        if (!options.silent) {
          this.trigger("change:height", this._height, oldHeight);
        }

        if (this.data && !options.noDraw) {
          this.draw(this.data);
        }
      }

      return this;
    }
  });
  
  var oldLayer = BaseChart.prototype.layer;
  BaseChart.prototype.layer = function(name, selection, options) {

    var chart = this;

    // just return an existing layer if all we are
    // passed is the name argument
    if (arguments.length === 1) {
      return oldLayer.call(this, name);
    }

    // save all the layer arguments. For layers that are created
    // but do not need to be rendered in the current mode, this
    // will ensure their arguments are intact for when they do
    // need to be created.
    chart._layersArguments[name] = {
      name : name,
      selection: selection,
      options : options,
      showing: false, // default hidden
      layer: null // layer handle
    };


    // create the layer if it should exist in the curret
    // mode.
    var layer;
    if (typeof options.modes === "undefined" ||
        ("modes" in options &&
          options.modes.indexOf(chart.mode()) > -1)) {

      // run default layer code
      layer = oldLayer.call(this, name, selection, options);

      // mark layer as showing.
      chart._layersArguments[name].showing = true;
      chart._layersArguments[name].layer = layer;
    }

    if ("modes" in options) {

      // save available modes on the layer if we created it
      if (layer) {
        layer._modes = options.modes;
      }

      // cache the layer under the mode name. This will be useful
      // when we are repainting layers.
      options.modes.forEach(function(mode) {
        
        // make sure mode exists
        if (mode in chart._modes) {
          
           chart._modeLayers[mode] = chart._modeLayers[mode] || [];

           // save the layer as being mapped to this mode.
           chart._modeLayers[mode].push(name);

        } else {
          throw new Error("Mode " + mode + " is not defined");
        }
      });

    // make sure this layer has all modes if none were
    // specified as an option.  
    } else if (chart._modes) {
      
      var allModes = Object.keys(chart._modes);
      
      if (layer) {
        layer._modes = allModes;
      }

      allModes.forEach(function(mode) {
        chart._modeLayers[mode] = chart._modeLayers[mode] || [];
        chart._modeLayers[mode].push(name);
      });

      // mark layer as showing.
      chart._layersArguments[name].showing = true;
      chart._layersArguments[name].layer = layer;
    }

    return layer;
  };

}(window.d3));