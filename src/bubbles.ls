# Declare the bubbles layer options.
#
o = {events: {}}

o.data-bind = (data) ->
    chart = @chart!
    chart.x-scale.domain [data[0], data[data.length-1]]
    @selectAll 'circle' .data data

o.insert = ->
    chart = @chart!
    @append 'circle'

o.events.merge = ->
    chart = @chart!
    @attr 'r', chart._radius
    @attr 'cy', chart.height() / 2
    @attr 'cx', (d) ->
        chart.x-scale d

exports.bubbles-options = o
