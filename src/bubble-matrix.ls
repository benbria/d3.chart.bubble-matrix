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
        @x-range_ = [0,0]
        @y-range_ = [0,0]
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
        @on \change:width, -> @setup-viewport_!
        @on \change:height, -> @setup-viewport_!

    # Do the initial data processing. Update the X and Y scale domains
    # according with the data length, and update the radius scale depending on
    # the available space.
    #
    transform: (data) ->
        row-count = data.length
        col-count = (@row-data_ data[0]).length
        x-delta = (@x-range_[1] - @x-range_[0]) / col-count
        y-delta = (@y-range_[1] - @y-range_[0]) / row-count
        @x-scale_.domain d3.range 0, col-count
        @y-scale_.domain d3.range 0, row-count
        delta = x-delta <? y-delta
        right = @x-range_[0] + delta * col-count
        bottom = @y-range_[0] + delta * row-count
        @x-scale_.rangePoints [@x-range_[0], right], HZ_PADDING
        @y-scale_.rangePoints [@y-range_[0], bottom], VT_PADDING
        @bottom-margin_ = bottom + COL_HEADER_PADDING * @height!
        delta = (@x-scale_ 1) - (@x-scale_ 0)
        @radius-scale_.range [0, delta * (1-RADIUS_PADDING) / 2]
        data

    # Setup the view ranges for the chart to fit in. This shall be called when
    # the parent element size change.
    #
    setup-viewport_: (delta) ->
        width = @width!
        height = @height!
        @left_ = ROW_HEADER_MARGIN * width
        @bottom_ = (1-COL_HEADER_MARGIN) * height
        @x-range_ = [@left_, width]
        @y-range_ = [0, @bottom_]
        left-margin = @left-margin_
        @left-margin_ = @left_ - ROW_HEADER_PADDING * width
        @trigger 'margin', @left-margin_ if @left-margin_ != left-margin

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
