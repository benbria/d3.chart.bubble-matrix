# Declare the BubbleMatrix chart.
#

makeProp = exports.makeProp

# Constants.
#
const HZ_PADDING = 1.0
const VT_PADDING = 1.0

# Declare the chart.
#
exports.bubble-matrix = d3.chart \BaseChart .extend \BubbleMatrix,
    initialize: ->
        @x-scale_ = d3.scale.ordinal!
        @y-scale_ = d3.scale.ordinal!
        @radius-scale_ = d3.scale.linear!
        bubbles-gr = @base.append \g .classed \bubbles, true
        @layer \bubbles, bubbles-gr, exports.bubbles-options
        @on \change:width, -> @setup-scales_!
        @on \change:height, -> @setup-scales_!

    # XXX: those are functions that let the graph extract the correct
    #      information from the data, but it's not very satisfying. This may
    #      be replaced by misoproject/d3.chart#26 eventually. See also issue
    #      misoproject/d3.chart#22.
    #
    row-key:        makeProp \rowKey_
    row-header:     makeProp \rowHeader_
    row-data:       makeProp \rowData_
    col-header:     makeProp \colHeader_
    radius:         makeProp \radius_
    color:          makeProp \color_

    # Set the input domain for bubble radiuses. The range is automatically
    # determined by the chart depending on the available space.
    #
    radius-domain:  makeProp \radiusDomain_, ->
        @radius-scale_.domain it

    # Set the color scale for bubbles.
    #
    color-scale:    makeProp \colorScale_

    setup-scales_: ->
        @x-scale_.rangePoints [0, @width!], HZ_PADDING
        @y-scale_.rangePoints [0, @height!], VT_PADDING
