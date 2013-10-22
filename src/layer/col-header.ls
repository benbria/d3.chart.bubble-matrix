# Declare the row-header layer, drawing the headers for every row.
#
o = {events: {}}

# Bind data to the header. The data for column headers is merely the
# range [0,N] where N is the column count.
#
o.data-bind = (data) ->
    chart = @chart!
    @select-all \text .data chart.x-scale_.domain!

# Insert a text for each column.
#
o.insert = ->
    chart = @chart!
    @append \text

# Update the text of each column header and its location.
#
o.events[\merge] = ->
    chart = @chart!
    bottom = chart.bottom-margin_ + chart.radius-scale_ 2
    @text (d) -> chart.col-header_ ...
    @attr \transform, (d, i) ->
        "translate(#{chart.x-scale_ i},#bottom)"

# Just remove exiting columns.
#
o.events[\exit] = ->
    @remove()

exports.col-header-options = o
