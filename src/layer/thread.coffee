# Declare the thread layer, that is the horizontal line going from bubble
# to bubble on each row; including the end tick at the left.
#
o = {events: {}}

# Height of the ending tick relative to the bubble radius.
#
TICK_HEIGHT = 1

# Bind data to the thread.
#
o.dataBind = (data) ->
    chart = @chart()
    @selectAll('g.thread').data data.rows, chart.rowKey_

# Insert groups for each thread.
#
o.insert = ->
    chart = @chart()
    g = @append('g').classed('thread', true).attr 'opacity', 0
    g.append 'path'
    g

transformThread = (sel, chart) ->
    @attr 'transform', (d, i) -> "translate(0,#{chart.yScale_ i})"

o.events['enter'] = ->
    @call transformThread, @chart()

# Make sure the thread is properly located and sized.
#
o.events['merge'] = ->
    chart = @chart()
    range = chart.xScale_.range()
    left = chart.leftMargin_
    tickHeight = TICK_HEIGHT * chart.maxRadius_
    path = "M #{left} -#{tickHeight/2} v #{tickHeight}"
    path += "M #{left} 0 H #{range[range.length-1]}"
    @select('path').attr 'd', path

# Fade-in an entering header.
o.events['enter:transition'] = ->
    chart = @chart()
    @duration chart.duration_
    @attr 'opacity', 1

# Move smoothly the header to its new location.
#
o.events['update:transition'] = ->
    chart = @chart()
    @duration chart.duration_
    @call transformThread, chart
    @attr 'opacity', 1

# Make the exiting header disappear smoothly.
#
o.events['exit:transition'] = ->
    chart = @chart()
    @duration chart.duration_
    @attr('opacity', 0).remove()

exports.layers['thread'] = o
