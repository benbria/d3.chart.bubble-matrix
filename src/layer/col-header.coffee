# Declare the row-header layer, drawing the headers for every row.
#
o = {events: {}}

# Bind data to the header. The data for column headers is merely the
# range [0,N] where N is the column count.
#
o.dataBind = (data) ->
    chart = @chart()
    @selectAll('text').data data.cols, chart.colKey_

# Insert a text for each column.
#
o.insert = ->
    chart = @chart()
    @append('text').attr 'opacity', 0

transformCol = (sel, chart) ->
    bottom = chart.bottomMargin_
    slanted = chart.slanted_
    @attr 'transform', (d, i) ->
        result = "translate(#{chart.xScale_ i},#{bottom})"
        result += 'rotate(45)' if slanted
        result

o.events['enter'] = ->
    @call transformCol, @chart()

# Update the text of each column header and its location.
#
o.events['merge'] = ->
    chart = @chart()
    @text chart.colHeader_

o.events['enter:transition'] = ->
    chart = @chart()
    @duration chart.duration_
    @attr 'opacity', 1

o.events['update:transition'] = ->
    chart = @chart()
    @duration chart.duration_
    @call transformCol, chart
    @attr 'opacity', 1

# Just remove exiting columns.
#
o.events['exit'] = ->
    @remove()

exports.layers['col-header'] = o
