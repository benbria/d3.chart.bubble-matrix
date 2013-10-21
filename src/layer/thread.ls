# Declare the thread layer, going from bubble to bubble on each row.
#
o = {events: {}}

const TICK_HEIGHT = 1

# Bind data to the thread.
#
o.data-bind = (data) ->
    chart = @chart!
    @select-all \g.thread .data data

# Insert groups for each thread.
#
o.insert = ->
    chart = @chart!
    g = @append \g .classed \thread, true
    g.append \path
    g

o.events[\merge] = ->
    chart = @chart!
    @attr \transform, (d, i) -> "translate(0,#{chart.y-scale_ i})"
    range = chart.x-scale_.range()
    left = chart.left-margin_ - chart.radius-scale_ 0.5
    tick-height = TICK_HEIGHT * chart.radius-scale_ 1
    path = "M #{left} -#{tick-height/2} v #{tick-height}"
    path += "M #{left} 0 H #{range[range.length-1]}"
    @select \path .attr \d, path

o.events[\exit] = ->
    @remove()

exports.thread-options = o
