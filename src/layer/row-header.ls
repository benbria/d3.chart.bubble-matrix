# Declare the row-header layer, drawing the headers for every row.
#
o = {events: {}}

# Bind data to the header.
#
o.data-bind = (data) ->
    chart = @chart!
    @select-all \text .data data

# Insert groups for header.
#
o.insert = ->
    chart = @chart!
    @append \text

o.events[\merge] = ->
    chart = @chart!
    range = chart.x-scale_.range()
    left = chart.left-margin_ - chart.radius-scale_ 2
    @text -> chart.row-header_ ...
    @attr \transform, (d, i) -> "translate(#left,#{chart.y-scale_ i})"

exports.row-header-options = o
