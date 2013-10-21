# Declare the BubbleMatrix chart.
#

makeProp = exports.makeProp

# Constants.
#
const HZ_PADDING = 1.0
const VT_PADDING = 1.0
const HZ_ROW_HEADER_MARGIN = 0.15
const HZ_COL_HEADER_MARGIN = 0.1

# Declare the chart.
#
exports.bubble-matrix = d3.chart \BaseChart .extend \BubbleMatrix,
    initialize: ->
        @base.classed \d3-chart-bubble-matrix, true
        @x-scale_ = d3.scale.ordinal!
        @y-scale_ = d3.scale.ordinal!
        @radius-scale_ = d3.scale.sqrt!
        @left-margin_ = 0
        thread-gr = @base.append \g .classed \thread, true
        bubble-gr = @base.append \g .classed \bubble, true
        row-header-gr = @base.append \g .classed \row-header, true
        col-header-gr = @base.append \g .classed \col-header, true
        @layer \bubble, bubble-gr, exports.bubble-options
        @layer \thread, thread-gr, exports.thread-options
        @layer \row-header, row-header-gr, exports.row-header-options
        @layer \col-header, col-header-gr, exports.col-header-options
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
        width = @width!
        height = @height!
        left = HZ_ROW_HEADER_MARGIN * width
        bottom = (1-HZ_COL_HEADER_MARGIN) * height
        @left-margin_ = left
        @bottom-margin_ = bottom
        @x-scale_.rangePoints [left, width], HZ_PADDING
        @y-scale_.rangePoints [0, bottom], VT_PADDING
