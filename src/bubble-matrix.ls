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

const DEFAULT_PALETTE = <[ #b2182b #d6604d #f4a582 #fddbc7 #f7f7f7
                           #d1e5f0 #92c5de #4393c3 #2166ac ]>

defaultColorScale = ->
    d3.scale.quantize!domain [0,1]
      .range DEFAULT_PALETTE

# Declare the chart.
#
exports.bubble-matrix = d3.chart \BaseChart .extend \BubbleMatrix,
    # Do the first-time setting. Notably:
    #
    #   * creating scales and internal variables;
    #   * creating layers and their base groups.
    #
    initialize: ->
        @load-defaults_!
        @base.classed \d3-chart-bubble-matrix, true
        @x-scale_ = d3.scale.ordinal!
        @y-scale_ = d3.scale.ordinal!
        @radius-scale_ = d3.scale.sqrt!
        @left-margin_ = 0
        @ruler_ = exports.text-ruler @base
        for layer in <[ thread bubble row-header col-header ]>
            gr = @base.append \g .classed layer, true
            @layer layer, gr, exports.layers[layer]

    # Load default values for the chart parameters.
    #
    load-defaults_: ->
        @rows_ or @rows -> it.rows
        @row-header_ or @row-header -> it.name
        @row-data_ or @row-data -> it.values
        @column_ or @columns -> it.columns
        @col-header_ or @col-header -> it
        @radius_ or @radius -> it[0]
        @color_ or @color -> it[1]
        @color-scale_ or @color-scale defaultColorScale!
        @slanted_ or @slanted false

    # Do the initial data processing. Update the X and Y scale domains
    # according with the data length, and update the radius scale depending on
    # the available space.
    #
    transform: (data) ->
        rows = @rows_ data
        cols = @columns_ data
        left = @update-left-margin_ rows, @width!
        bottom = @get-max-bottom_ cols, @height!
        x-delta = (@width! - left) / cols.length
        y-delta = (bottom - 0) / rows.length
        @x-scale_.domain d3.range 0, cols.length
        @y-scale_.domain d3.range 0, rows.length
        delta = x-delta <? y-delta
        right = left + delta * cols.length
        bottom = delta * rows.length
        @x-scale_.rangePoints [left, right], HZ_PADDING
        @y-scale_.rangePoints [0, bottom], VT_PADDING
        @bottom-margin_ = bottom + COL_HEADER_PADDING * @height!
        delta = (@x-scale_ 1) - (@x-scale_ 0)
        @radius-scale_.range [0, delta * (1-RADIUS_PADDING) / 2]
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
    update-left-margin_: (data, width) ->
        left-margin = @left-margin_
        @left-margin_ = ld.reduce data, (r, d) ~>
            r >? @ruler_ (@row-header_ d)
        @left-margin_ += ROW_HEADER_MARGIN * width
        @trigger 'margin', @left-margin_ if @left-margin_ != left-margin
        @left-margin_ + ROW_HEADER_PADDING * width

    # Get the maximum acceptable bottom position of the available
    # space to draw the chart bubbles.
    #
    # This is determined by the height of the context font.
    #
    get-max-bottom_: (data, height) ->
        height - 2 * (@ruler_.extentOfChar 'W' .height)

    # XXX: those are functions that let the graph extract the correct
    #      information from the data, but it's not very satisfying. This may
    #      be replaced by misoproject/d3.chart#26 eventually. See also issue
    #      misoproject/d3.chart#22.
    #
    # Settings that affect the way row information is retrieved.
    #
    rows:           makeProp \rows_
    row-key:        makeProp \rowKey_
    row-header:     makeProp \rowHeader_
    row-data:       makeProp \rowData_

    # Settings that affect the way column information is retrieved.
    #
    columns:        makeProp \columns_
    col-key:        makeProp \colKey_
    col-header:     makeProp \colHeader_

    # Settings that affect the way bubble information is retrieved.
    #
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
