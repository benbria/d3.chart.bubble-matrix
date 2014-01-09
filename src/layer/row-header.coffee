# Declare the row-header layer, drawing the headers for every row.
#
o = {events: {}}

# Bind data to the header.
#
o.dataBind = (data) ->
    chart = @chart()
    @selectAll('text').data data.rows, chart.rowKey_

# Insert a text for each row.
#
o.insert = ->
    chart = @chart()
    @append('text').attr('opacity', 0)
                   .attr 'dy', '0.38em'

transformRow = (sel, chart) ->
    width = chart.width()
    left = chart.rowHeaderLeft_
    @attr 'transform', (d, i) ->
        "translate(#{left},#{chart.yScale_ i})"

# Update the text of each row header and its location.
#
o.events['enter'] = ->
    chart = @chart()
    @call transformRow, chart

o.events['merge'] = ->
    chart = @chart()
    @text -> chart.rowHeader_.apply(this, arguments)

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
    @call transformRow, chart
    @attr 'opacity', 1

# Make the exiting header disappear smoothly.
#
o.events['exit:transition'] = ->
    chart = @chart()
    @duration chart.duration_
    @attr('opacity', 0).remove()

exports.layers['row-header'] = o
