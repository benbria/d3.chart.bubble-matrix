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
    left = chart.left-margin_ - chart.radius-scale_ 2
    @text -> chart.row-header_ ...
    @attr \transform, (d, i) ->
        "translate(#left,#{chart.y-scale_ i})"

o.events[\exit] = ->
    @remove()

exports.row-header-options = o
