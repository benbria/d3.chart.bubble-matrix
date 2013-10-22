# Declare the BubbleMatrix chart.
#

makeProp = exports.makeProp

# Constants.
#
const HZ_PADDING = 1.0
const VT_PADDING = 1.0
const ROW_HEADER_MARGIN = 0.15
const COL_HEADER_MARGIN = 0.1
const ROW_HEADER_PADDING = 0.01
const COL_HEADER_PADDING = 0.06

# Relative padding between the bubbles.
const RADIUS_PADDING = 0.1

# Declare the chart.
#
exports.bubble-matrix = d3.chart \BaseChart .extend \BubbleMatrix,
    # Do the first-time setting. Notably:
    #
    #   * creating scales and internal variables;
    #   * creating layers and their base groups;
    #   * registering to size change events.
    #
    initialize: ->
        @base.classed \d3-chart-bubble-matrix, true
        @x-scale_ = d3.scale.ordinal!
        @y-scale_ = d3.scale.ordinal!
        @radius-scale_ = d3.scale.sqrt!
        @left-margin_ = 0
        @slanted_ or @slanted false
        thread-gr = @base.append \g .classed \thread, true
        bubble-gr = @base.append \g .classed \bubble, true
        row-header-gr = @base.append \g .classed \row-header, true
        col-header-gr = @base.append \g .classed \col-header, true
        @layer \thread, thread-gr, exports.thread-options
        @layer \bubble, bubble-gr, exports.bubble-options
        @layer \row-header, row-header-gr, exports.row-header-options
        @layer \col-header, col-header-gr, exports.col-header-options
        @on \change:width, -> @setup-scales_!
        @on \change:height, -> @setup-scales_!

    # Do the initial data processing. Update the X and Y scale domains
    # according with the data length, and update the radius scale depending on
    # the available space.
    #
    transform: (data) ->
        chart = this
        chart.y-scale_.domain d3.range 0, data.length
        chart.x-scale_.domain d3.range 0, (chart.row-data_ data[0]).length
        x-delta = (chart.x-scale_ 1) - (chart.x-scale_ 0)
        y-delta = (chart.y-scale_ 1) - (chart.y-scale_ 0)
        delta = x-delta <? y-delta
        chart.radius-scale_.range [0, delta * (1-RADIUS_PADDING) / 2]
        data

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

    # Enable slanted column labels.
    #
    slanted:        makeProp \slanted_

    setup-scales_: ->
        width = @width!
        height = @height!
        left = ROW_HEADER_MARGIN * width
        bottom = (1-COL_HEADER_MARGIN) * height
        @left-margin_ = left - ROW_HEADER_PADDING * width
        @bottom-margin_ = bottom + COL_HEADER_PADDING * height
        @x-scale_.rangePoints [left, width], HZ_PADDING
        @y-scale_.rangePoints [0, bottom], VT_PADDING
        @trigger 'margin', @left-margin_
