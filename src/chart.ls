# Declare the BubbleMatrix chart.
#

makeProp = exports.makeProp

# Constants.
#
const CHART_NAME = \BubbleMatrix
const CHART_ID = \d3-chart-bubble-matrix

# Padding, horizontal and vertical, for bubbles columns and rows.
const HZ_PADDING = 1.0
const VT_PADDING = 1.0

# Relative padding between the bubbles.
const RADIUS_PADDING = 0.1

# Based on the color specifications of Cynthia Brewer
# (http://colorbrewer.org/). Namely, the RdBu with 9 items.
const DEFAULT_PALETTE = <[ #b2182b #d6604d #f4a582 #fddbc7 #f7f7f7
                           #d1e5f0 #92c5de #4393c3 #2166ac ]>

defaultColorScale = ->
    d3.scale.quantize!domain [0,1]
      .range DEFAULT_PALETTE

# Declare the chart.
#
exports.Chart = d3.chart \BaseChart .extend CHART_NAME,
    # Do the first-time setting. Notably:
    #
    #   * creating scales and internal variables;
    #   * creating layers and their base groups.
    #
    initialize: ->
        @load-defaults_!
        @base.classed CHART_ID, true
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
        @size_ or @size -> it[0]
        @color_ or @color -> it[1]
        @color-scale_ or @color-scale defaultColorScale!
        @slanted_ or @slanted false
        @duration_ or @duration 250

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
        padding = (@ruler_.extentOfChar 'W' .height)
        @bottom-margin_ = bottom + padding * 1.3
        delta = (@x-scale_ 1) - (@x-scale_ 0)
        @max-radius_ = delta * (1-RADIUS_PADDING) / 2
        @radius-scale_.range [0, @max-radius_]
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
        @row-header-left_ = ld.reduce data, (r, d) ~>
            r >? @ruler_ (@row-header_ d)
        padding = (@ruler_.extentOfChar 'W' .width)
        @row-header-left_ += padding
        @left-margin_ = @row-header-left_ + padding
        @trigger 'margin', @left-margin_ if @left-margin_ != left-margin
        @left-margin_ + (@ruler_.extentOfChar 'W' .width)

    # Get the maximum acceptable bottom position of the available
    # space to draw the chart bubbles.
    #
    # This is determined by the height of the context font.
    #
    get-max-bottom_: (data, height) ->
        height - 2 * (@ruler_.extentOfChar 'W' .height)

    # XXX(jeanlauliac): those are functions that let the graph extract the
    # correct information from the data, but it's not very satisfying. This may
    # be replaced by misoproject/d3.chart#26 eventually. See also issue
    # misoproject/d3.chart#22.
    #
    # Settings that affect the way row information is retrieved.
    #
    rows:           makeProp \rows_
    row-header:     makeProp \rowHeader_
    row-key:        makeProp \rowKey_
    row-data:       makeProp \rowData_

    # Settings that affect the way column information is retrieved.
    #
    columns:        makeProp \columns_
    col-header:     makeProp \colHeader_
    col-key:        makeProp \colKey_

    # Settings that affect the way bubble information is retrieved.
    #
    size:           makeProp \size_
    color:          makeProp \color_

    # Set the input domain for bubble radiuses. The range is automatically
    # determined by the chart depending on the available space.
    #
    size-domain:  makeProp \sizeDomain_, ->
        @radius-scale_.domain it

    # Set the color scale for bubbles.
    #
    color-scale:    makeProp \colorScale_

    # Enable slanted column labels.
    #
    # FIXME(jeanlauliac): very experimental, need to improve the feature.
    #
    slanted:        makeProp \slanted_

    # Set the duration of all chart transitions.
    #
    duration:       makeProp \duration_
