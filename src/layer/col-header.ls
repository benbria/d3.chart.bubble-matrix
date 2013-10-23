# Declare the row-header layer, drawing the headers for every row.
#
o = {events: {}}

# Bind data to the header. The data for column headers is merely the
# range [0,N] where N is the column count.
#
o.data-bind = (data) ->
    chart = @chart!
    col-data = [chart.col-header_ i for i in chart.x-scale_.domain!]
    @select-all \text .data col-data

# Insert a text for each column.
#
o.insert = ->
    chart = @chart!
    @append \text .attr \opacity 0

transform-col = (sel, chart) ->
    bottom = chart.bottom-margin_
    slanted = chart.slanted_
    @attr \transform, (d, i) ->
        result = "translate(#{chart.x-scale_ i},#bottom)"
        result += 'rotate(45)' if slanted
        result

o.events[\enter] = ->
    @call transform-col, @chart!

# Update the text of each column header and its location.
#
o.events[\merge] = ->
    chart = @chart!
    @text (d) -> d

o.events[\enter:transition] = ->
    @attr \opacity 1

o.events[\update:transition] = ->
    chart = @chart!
    @call transform-col, chart

# Just remove exiting columns.
#
o.events[\exit] = ->
    @remove()

exports.col-header-options = o
