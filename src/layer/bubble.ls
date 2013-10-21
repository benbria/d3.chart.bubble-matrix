# Declare the bubbles layer options.
#
o = {events: {}}

const RADIUS_PADDING = 0.1
const STROKE_WIDTH = 0.15

# Bind data to the bubble rows.
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

# Handle the enter event for a bubble.
#
bubble-enter = (sel, chart) ->
    @attr \r, 0
    @attr \fill, 'white'

# Handle the merge (enter + existing) event for a bubble.
#
bubble-merge = (sel, chart) ->
    @attr \cx, (d, i) -> chart.x-scale_ i
    @attr \stroke-width, STROKE_WIDTH * chart.radius-scale_ 1

# Handle the merge transition for a bubble.
#
bubble-merge-transition = (sel, chart) ->
    @delay (d, i, j) -> i*10+j*10
    @duration 300
    @attr \r, (d) -> chart.radius-scale_ (chart.radius_ d)
    @each (d) ->
        color = chart.color-scale_ (chart.color_ d)
        d3.select(this).transition()
            .attr \fill, color
        # FIXME: make it configurable, or remove it definitely.
        #@setAttribute \stroke, d3.lab(color).darker(0.2).toString()

# Handle the merge event for a bubble row.
#
o.events[\merge] = ->
    chart = @chart!
    @attr \transform, (d, i) -> "translate(0,#{chart.y-scale_ i})"
    bubbles = @select-all \circle .data (d) -> chart.row-data_ d
    bubbles.enter!append \circle .call bubble-enter, chart
    bubbles.call bubble-merge, chart

o.events[\merge:transition] = ->
    chart = @chart!
    @select-all \circle .call bubble-merge-transition, chart

exports.bubble-options = o
