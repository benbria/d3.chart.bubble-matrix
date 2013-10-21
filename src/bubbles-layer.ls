# Declare the bubbles layer options.
#
o = {events: {}}

# Bind data to the bubble rows.
#
o.data-bind = (data) ->
    chart = @chart!
    chart.y-scale_.domain d3.range 0, data.length
    chart.x-scale_.domain d3.range 0, (chart.row-data_ data[0]).length
    delta = (chart.x-scale_ 1) - (chart.x-scale_ 0)
    chart.radius-scale_.range [0, delta / 2]
    @select-all \g.row .data data

# Insert groups for each bubble row.
#
o.insert = ->
    chart = @chart!
    @append \g .classed \row, true

# Handle the merge (enter + existing) event of a single row bubbles selection.
bubble-merge = (sel, chart) ->
    @attr \cx, (d, i) -> chart.x-scale_ i
    @attr \r, (d) -> chart.radius-scale_ (chart.radius_ d)
    @each (d) ->
        color = chart.color-scale_ (chart.color_ d)
        @setAttribute \fill, color
        # FIXME: make it configurable, or remove it definitely.
        #@setAttribute \stroke, d3.lab(color).darker().toString()

# Handle the merge event for a bubble row.
#
o.events.merge = ->
    chart = @chart!
    @attr \transform, (d, i) -> "translate(0,#{chart.y-scale_ i})"
    bubbles = @select-all \circle .data (d) -> chart.row-data_ d
    bubbles.enter!append \circle
    bubbles.call bubble-merge, chart

    # @attr \r, @radius_
    # @attr \cy, chart.height() / 2
    # @attr \cx, (d) ->
    #     console.log d
    #     chart.x-scale_ d

exports.bubbles-options = o
