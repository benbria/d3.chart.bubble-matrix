# Declare the thread layer, that is the horizontal line going from bubble
# to bubble on each row; including the end tick at the left.
#
o = {events: {}}

# Height of the ending tick relative to the bubble radius.
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

# Make sure the thread is properly located and sized.
#
o.events[\merge] = ->
    chart = @chart!
    @attr \transform, (d, i) -> "translate(0,#{chart.y-scale_ i})"
    range = chart.x-scale_.range()
    left = chart.left-margin_
    tick-height = TICK_HEIGHT * chart.radius-scale_ 1
    path = "M #{left} -#{tick-height/2} v #{tick-height}"
    path += "M #{left} 0 H #{range[range.length-1]}"
    @select \path .attr \d, path

# Remove exiting thread groups.
#
o.events[\exit] = ->
    @remove()

exports.thread-options = o
