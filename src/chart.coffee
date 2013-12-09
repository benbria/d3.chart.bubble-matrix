# Declare the BubbleMatrix chart.
#

makeProp = exports.makeProp

# Constants.
#
CHART_NAME = 'BubbleMatrix'
CHART_ID = 'd3-chart-bubble-matrix'

# Padding, horizontal and vertical, for bubbles columns and rows.
HZ_PADDING = 1.0
VT_PADDING = 1.0

# Relative padding between the bubbles.
RADIUS_PADDING = 0.1

# Based on the color specifications of Cynthia Brewer
# (http://colorbrewer.org/). Namely, the RdBu with 9 items.
DEFAULT_PALETTE = ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7',
                   '#d1e5f0', '#92c5de', '#4393c3', '#2166ac']

# Make a new instance of the default color scale.
#
defaultColorScale = ->
    d3.scale.quantize().domain([0,1])
      .range DEFAULT_PALETTE

# Declare the chart.
#
exports.Chart = d3.chart('BaseChart').extend CHART_NAME,
    # Do the first-time setting. Notably:
    #
    #   * creating scales and internal variables;
    #   * creating layers and their base groups.
    #
    initialize: ->
        @loadDefaults_()
        @base.classed CHART_ID, true
        @xScale_ = d3.scale.ordinal()
        @yScale_ = d3.scale.ordinal()
        @radiusScale_ = d3.scale.sqrt()
        @leftMargin_ = 0
        for layer in ['thread', 'bubble', 'row-header', 'col-header']
            gr = @base.append('g').classed layer, true
            @layer layer, gr, exports.layers[layer]

    # Load default values for the chart parameters.
    #
    loadDefaults_: ->
        @rows_ or @rows (d) -> d.rows
        @rowHeader_ or @rowHeader (d) -> d.name
        @rowData_ or @rowData (d) -> d.values
        @column_ or @columns (d) -> d.columns
        @colHeader_ or @colHeader (d) -> d
        @size_ or @size (d) -> d[0]
        @color_ or @color (d) -> d[1]
        @colorScale_ or @colorScale defaultColorScale()
        @slanted_ or @slanted false
        @duration_ or @duration 250

    # Do the initial data processing. Update the X and Y scale domains
    # according with the data length, and update the radius scale depending on
    # the available space.
    #
    transform: (data) ->
        @ruler_ = exports.textRuler @base
        rows = @rows_ data
        cols = @columns_ data
        left = @updateLeftMargin_ rows, @width()
        bottom = @getMaxBottom_ cols, @height()
        xDelta = (@width() - left) / cols.length
        yDelta = (bottom - 0) / rows.length
        @xScale_.domain d3.range(0, cols.length)
        @yScale_.domain d3.range(0, rows.length)
        delta = Math.min(xDelta, yDelta)
        right = left + delta * cols.length
        bottom = delta * rows.length
        @xScale_.rangePoints [left, right], HZ_PADDING
        @yScale_.rangePoints [0, bottom], VT_PADDING
        padding = @ruler_.extentOfChar('W').height
        @bottomMargin_ = bottom + padding * 1.3
        delta = (@xScale_ 1) - (@xScale_ 0)
        @maxRadius_ = delta * (1-RADIUS_PADDING) / 2
        @radiusScale_.range [0, @maxRadius_]
        {rows, cols}

    # Update the left margin, and return the left position of the available
    # space to draw the chart bubbles.
    #
    # This is done by determining the largest row header, and adding the
    # necessary margin (left of the thread tick) and padding (between the
    # tick and the first bubble).
    #
    # The `margin` event is raised when the margin change. This gives the
    # opportunity for the chart consumer to adjust the SVG negative margin so
    # that bubble threads are beautifully aligned on the surrounding layout.
    #
    updateLeftMargin_: (data, width) ->
        leftMargin = @leftMargin_
        maxWidth = (r, d, i) => Math.max(r, @ruler_(@rowHeader_(d, i)))
        @rowHeaderLeft_ = ld.reduce data, maxWidth, 0
        padding = @ruler_.extentOfChar('W').width
        @rowHeaderLeft_ += padding
        @leftMargin_ = @rowHeaderLeft_ + padding
        @trigger 'margin', @leftMargin_ if @leftMargin_ != leftMargin
        @leftMargin_ + @ruler_.extentOfChar('W').width

    # Get the maximum acceptable bottom position of the available
    # space to draw the chart bubbles.
    #
    # This is determined by the height of the context font.
    #
    getMaxBottom_: (data, height) ->
        height - 2 * @ruler_.extentOfChar('W').height

    # XXX(jeanlauliac): those are functions that let the graph extract the
    # correct information from the data, but it's not very satisfying. This may
    # be replaced by misoproject/d3.chart#26 eventually. See also issue
    # misoproject/d3.chart#22.
    #
    # Settings that affect the way row information is retrieved.
    #
    rows:           makeProp 'rows_'
    rowHeader:      makeProp 'rowHeader_'
    rowKey:         makeProp 'rowKey_'
    rowData:        makeProp 'rowData_'

    # Settings that affect the way column information is retrieved.
    #
    columns:        makeProp 'columns_'
    colHeader:      makeProp 'colHeader_'
    colKey:         makeProp 'colKey_'

    # Settings that affect the way bubble information is retrieved.
    #
    size:           makeProp 'size_'
    color:          makeProp 'color_'

    # Set the input domain for bubble radiuses. The range is automatically
    # determined by the chart depending on the available space.
    #
    sizeDomain:     makeProp 'sizeDomain_', (it) ->
        @radiusScale_.domain it

    # Set the color scale for bubbles.
    #
    colorScale:     makeProp 'colorScale_'

    # Enable slanted column labels.
    #
    # FIXME(jeanlauliac): very experimental, need to improve the feature.
    #
    slanted:        makeProp 'slanted_'

    # Set the duration of all chart transitions.
    #
    duration:       makeProp 'duration_'
