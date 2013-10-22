# Declare the row-header layer, drawing the headers for every row.
#
o = {events: {}}

const ROW_HEADER_PADDING = 0.01

# Bind data to the header.
#
o.data-bind = (data) ->
    chart = @chart!
    @select-all \text .data data

# Insert a text for each row.
#
o.insert = ->
    chart = @chart!
    @append \text

# Update the text of each row header and its location.
#
o.events[\merge] = ->
    chart = @chart!
    width = chart.width!
    left = chart.left-margin_ - ROW_HEADER_PADDING * width
    @text -> chart.row-header_ ...
    @attr \transform, (d, i) ->
        "translate(#left,#{chart.y-scale_ i})"

# Just remove exiting headers.
#
o.events[\exit] = ->
    @remove()

exports.row-header-options = o
