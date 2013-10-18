(function() {
    var chart = d3.select("#vis")
        .append("svg")
        .chart("BubbleMatrix");

    var data = [1,4,6,9,12,13,30];

    onResize = function() {
        chart.width(window.innerWidth-50);
        chart.height(window.innerHeight-50);
        chart.draw(data);
    }

    window.addEventListener("resize", onResize);
    onResize();

    chart.draw(data);

}());
