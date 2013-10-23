# Declare the bubbles layer options.
#
o = {events: {}}

# White-space amount around bubbles as a coef. of the maximum radius.
const STROKE_WIDTH = 0.15

# Bind data to the bubble rows.
#
o.data-bind = (data) ->
    chart = @chart!
    @select-all \g.row .data data, chart.row-key_

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

bubble-enter-transition = (sel, chart) ->

# Make sure both entering and existing bubbles are at the correct location
# and have the correct white spacing around.
#
bubble-merge = (sel, chart) ->
    @attr \stroke-width, STROKE_WIDTH * chart.radius-scale_ 1

# Remove bubbles.
#
bubble-exit = (sel, chart) ->
    @remove()

# Transition the bubbles to their final radius and color, according with data.
#
bubble-merge-transition = (sel, chart) ->
    @attr \opacity, 1
    @attr \cx, (d, i) -> chart.x-scale_ i
    if chart.swoop_
        @duration 200
        @delay (d, i, j) -> i*5+j*10
    @attr \r, (d) -> chart.radius-scale_ (chart.radius_ d)
    @attr \fill, (d) -> chart.color-scale_ (chart.color_ d)

transform-row = (sel, chart) ->
    @attr \transform, (d, i) -> "translate(0,#{chart.y-scale_ i})"

o.events[\enter] = ->
    chart = @chart!
    @call transform-row, chart

# Ensure entering and exisiting rows are at the correct location, then
# add/remove bubbles as necessary for each row.
#
o.events[\merge] = ->
    chart = @chart!
    bubbles = @select-all \circle .data (d) -> chart.row-data_ d
    bubbles.enter!append \circle .call bubble-enter, chart
    bubbles.exit!call bubble-exit, chart
    bubbles.call bubble-merge, chart
    bubbles.transition!call bubble-merge-transition, chart

o.events[\update:transition] = ->
    chart = @chart!
    @call transform-row, chart

# Transition each bubble in rows.
#
#o.events[\merge:transition] = ->
#    chart = @chart!

# Remove exiting rows.
#
o.events[\exit] = ->
    @remove()

exports.bubble-options = o
