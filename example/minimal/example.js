var chart = d3.select('#vis').append('svg')
              .chart('BubbleMatrix')
              .width(400).height(200);

chart.draw(exampleData);
