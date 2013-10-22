# Declare the row-header layer, drawing the headers for every row.
#
o = {events: {}}

const ROW_HEADER_PADDING = 0.01

# Bind data to the header.
#
o.data-bind = (data) ->
    chart = @chart!
    @select-all \text .data data, chart.row-key_

# Insert a text for each row.
#
o.insert = ->
    chart = @chart!
    @append \text .attr \opacity 0

transform-row = (sel, chart) ->
    width = chart.width!
    left = chart.left-margin_ - ROW_HEADER_PADDING * width
    @attr \transform, (d, i) ->
        "translate(#left,#{chart.y-scale_ i})"

# Update the text of each row header and its location.
#
o.events[\enter] = ->
    chart = @chart!
    @call transform-row, chart

o.events[\merge] = ->
    chart = @chart!
    @text -> chart.row-header_ ...

# Fade-in an entering header.
o.events[\enter:transition] = ->
    @attr \opacity, 1

# Move smoothly the header to its new location.
#
o.events[\update:transition] = ->
    chart = @chart!
    @call transform-row, chart

# Make the exiting header disappear smoothly.
#
o.events[\exit:transition] = ->
    @attr \opacity 0 .remove!

# Just remove exiting headers.
#
#o.events[\exit] = ->
    #@remove()

exports.row-header-options = o
