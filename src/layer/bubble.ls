# Declare the bubbles layer options.
#
o = {events: {}}

# White-space amount around bubbles as a coef. of the maximum radius.
const STROKE_WIDTH = 0.15

# Bind data to the bubble rows.
#
o.data-bind = (data) ->
    chart = @chart!
    if chart.col-key_
        chart.bubble-key_ = (d, i) ->
            chart.col-key_ data.cols[i], i
    else
        chart.bubble-key_ = undefined
    @select-all \g.row .data data.rows, chart.row-key_

# Insert groups for each bubble row.
#
o.insert = ->
    chart = @chart!
    @append \g .classed \row, true

# Make a bubble enter the chart. It starts at radius 0 and animate smoothly
# to the final radius.
#
bubble-enter = (sel, chart) ->
    @attr \r, 0
    @attr \fill, (d) -> chart.color-scale_ (chart.color_ d)
    @attr \opacity, 0
    @attr \cx, (d, i) -> chart.x-scale_ i

# Make sure both entering and existing bubbles are at the correct location
# and have the correct white spacing around.
#
bubble-merge = (sel, chart) ->
    @attr \stroke-width, STROKE_WIDTH * chart.max-radius_

# Remove bubbles.
#
bubble-exit = (sel, chart) ->
    @remove()

# Transition the bubbles to their final radius and color, according with data.
#
bubble-merge-transition = (sel, chart) ->
    @duration chart.duration_
    @attr \opacity, 1
    @attr \cx, (d, i) -> chart.x-scale_ i
    @attr \r, (d) -> chart.radius-scale_ (chart.size_ d)
    @attr \fill, (d) -> chart.color-scale_ (chart.color_ d)

transform-row = (sel, chart) ->
    @attr \transform, (d, i) -> "translate(0,#{chart.y-scale_ i})"

o.events[\enter] = ->
    chart = @chart!
    @call transform-row, chart

# Ensure entering and exisiting rows are at the correct location, then
# add/remove bubbles as necessary for each row.
#
# We use a special technique in this function, that can probably be called a
# hack, to keep track of keys for each bubble. Since we can't deduce the key
# from the data only (columns provide the keys, not the bubble data
# themselves), we store on each bubble DOM element the `__key__` based on the
# index. Then, the next time, d3.js run the `key` function on two different
# series: one time on the input data items (then `this instanceof Array`), and
# one time on existing elements (then `this` is the DOM element), where
# we can retrieve the key we just stored.
#
# This can be considered a limititation of d3.js, in a sense. It would be
# interesting being able to set different key-function for input and existing
# items. Or, even better, d3.js could store the __key__ itself instead of
# requiring it... perhaps it would raise other problems.
#
# See the behavior explanation on
# https://github.com/mbostock/d3/wiki/Selections#wiki-data.
#
o.events[\merge] = ->
    chart = @chart!
    if chart.bubble-key_?
        key = ->
            if this instanceof Array
                return chart.bubble-key_ ...
            @__key__
    bubbles = @select-all \circle
              .data chart.row-data_, key
    bubbles.enter!append \circle
           .call bubble-enter, chart
    bubbles.exit!call bubble-exit, chart
    bubbles.call bubble-merge, chart
    if key?
        bubbles.each (d, i) ->
            @__key__ = chart.bubble-key_ d, i
    bubbles.transition!call bubble-merge-transition, chart

o.events[\update:transition] = ->
    chart = @chart!
    @duration chart.duration_
    @call transform-row, chart

# Remove exiting rows.
#
o.events[\exit] = ->
    @remove()

exports.layers[\bubble] = o
