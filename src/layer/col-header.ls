# Declare the row-header layer, drawing the headers for every row.
#
o = {events: {}}

# Bind data to the header.
#
o.data-bind = (data) ->
    chart = @chart!
    @select-all \text .data chart.x-scale_.domain!

# Insert groups for header.
#
o.insert = ->
    chart = @chart!
    @append \text

o.events[\merge] = ->
    chart = @chart!
    bottom = chart.bottom-margin_ + chart.radius-scale_ 2
    @text (d) -> chart.col-header_ ...
    @attr \transform, (d, i) ->
        "translate(#{chart.x-scale_ i},#bottom)"

exports.col-header-options = o
