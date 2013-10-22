# Declare the bubbles layer options.
#
o = {events: {}}

# Relative padding between the bubbles.
const RADIUS_PADDING = 0.1
# White-space amount around bubbles as a coef. of the maximum radius.
const STROKE_WIDTH = 0.15

# Bind data to the bubble rows. It also update the X and Y scale domains
# according with the data length, and update the radius scale depending
# on the available space.
#
o.data-bind = (data) ->
    chart = @chart!
    chart.y-scale_.domain d3.range 0, data.length
    chart.x-scale_.domain d3.range 0, (chart.row-data_ data[0]).length
    delta = (chart.x-scale_ 1) - (chart.x-scale_ 0)
    delta2 = (chart.y-scale_ 1) - (chart.y-scale_ 0)
    delta = if delta < delta2 then delta else delta2
    chart.radius-scale_.range [0, delta * (1-RADIUS_PADDING) / 2]
    @select-all \g.row .data data

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
    @attr \fill, 'white'

# Make sure both entering and existing bubbles are at the correct location
# and have the correct white spacing around.
#
bubble-merge = (sel, chart) ->
    @attr \cx, (d, i) -> chart.x-scale_ i
    @attr \stroke-width, STROKE_WIDTH * chart.radius-scale_ 1

# Remove bubbles.
#
bubble-exit = (sel, chart) ->
    @remove()

# Transition the bubbles to their final radius and color, according with data.
#
bubble-merge-transition = (sel, chart) ->
    @delay (d, i, j) -> i*5+j*20
    @duration 200
    @attr \r, (d) -> chart.radius-scale_ (chart.radius_ d)
    @each (d) ->
        color = chart.color-scale_ (chart.color_ d)
        d3.select(this).transition()
            .attr \fill, color
        # FIXME: make it configurable, or remove it definitely.
        #@setAttribute \stroke, d3.lab(color).darker(0.2).toString()

# Ensure entering and exisiting rows are at the correct location, then
# add/remove bubbles as necessary for each row.
#
o.events[\merge] = ->
    chart = @chart!
    @attr \transform, (d, i) -> "translate(0,#{chart.y-scale_ i})"
    bubbles = @select-all \circle .data (d) -> chart.row-data_ d
    bubbles.enter!append \circle .call bubble-enter, chart
    bubbles.exit!call bubble-exit, chart
    bubbles.call bubble-merge, chart

# Transition each bubble in rows.
#
o.events[\merge:transition] = ->
    chart = @chart!
    @select-all \circle .call bubble-merge-transition, chart

# Remove exiting rows.
#
o.events[\exit] = ->
    @remove()

exports.bubble-options = o
