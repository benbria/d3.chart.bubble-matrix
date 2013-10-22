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
    @append \text

# Update the text of each column header and its location.
#
o.events[\merge] = ->
    chart = @chart!
    slanted = chart.slanted_
    bottom = chart.bottom-margin_
    @text (d) -> d
    @attr \transform, (d, i) ->
        result = "translate(#{chart.x-scale_ i},#bottom)"
        result += 'rotate(45)' if slanted
        result

# Just remove exiting columns.
#
o.events[\exit] = ->
    @remove()

exports.col-header-options = o
