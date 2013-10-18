# Declare the chart from its layers.
#
exports.bubble-matrix = d3.chart 'BaseChart' .extend 'BubbleMatrix',
    initialize: ->
        @x-scale = d3.scale.linear!
        bubbles-gr = @base.append 'g' .classed 'bubbles', true
        @layer 'bubbles', bubbles-gr, exports.bubbles-options
        @on 'change:width', ->
            @setupRadius!
            @x-scale.range [@_radius, it - @_radius]
        @on 'change:height', ->
            @setupRadius!

    setupRadius: ->
        @_radius = Math.min(@width!/10, @height!/5)
