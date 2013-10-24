# d3.chart.bubble-matrix

A bubble-matrix chart, working on any kind of bidimensional data.

![bubble matrix](/doc/screenshot.png)

### Sample Use

We assume `d3`, `lodash`, `d3.chart` and `d3.chart.base` libraries files are in
the same directory as the example.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <script src="d3.js"></script>
        <script src="lodash.js"></script>
        <script src="d3.chart.js"></script>
        <script src="d3.chart.base.js"></script>
        <script src="d3.chart.bubble-matrix.js"></script>
        <link rel="stylesheet" type="text/css"
              href="d3.chart.bubble-matrix.css">
        <link rel="stylesheet" type="text/css"
              href="d3.chart.bubble-matrix.default.css">
    </head>
    <body>
        <div id='vis'>
        <script src="data.js"></script>
        <script src="example.js"></script>
    </body>
</html>
```

```js
/*! example.js */
var chart = d3.select().append('svg')
              .chart('BubbleMatrix')
              .width(600).height(400);

chart.draw(exampleData);
```

```js
/*! data.js */
var chartData = {
    cols: ['the', 'cake', 'is', 'a', 'lie'],
    rows: [
        {name: 'foo', values: [[0.4, 0.5], [0.3, 0.7], [0.2, 0.3],
                               [0.7, 0.9], [0.5, 0.2]]},
        {name: 'bar', values: [[0.3, 0.7], [0.4, 0.5], [0.7, 0.9],
                               [0.5, 0.2], [0.2, 0.3]]},
        {name: 'baz', values: [[0.4, 0.5], [0.3, 0.7], [0.2, 0.3],
                               [0.7, 0.9], [0.5, 0.2]]},
        {name: 'glo', values: [[0.4, 0.5], [0.3, 0.7], [0.2, 0.3],
                               [0.7, 0.9], [0.5, 0.2]]}
    ]
}
```

### Browser compatibility

Tested on Chrome 30, Firefox 22 and IE10.

### API

Sample API Documentation:

#### `<instance>.highlight(value)`

**Description:**

Allows the highlighting of a specific value

**Parameters:**

* `value` - The value to highlight.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyEpicChart")
  .higlight(12);
```

### Events

Sample Event Documentation:

#### `brush`

**Description:**

Broadcast when a circle on the chart is being mousedover

**Arguments:**

* `value` - The value corresponding to the circle being mousedover.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyEpicChart");

chart.on("brush", function(value) {
  // handle event...
});
```
