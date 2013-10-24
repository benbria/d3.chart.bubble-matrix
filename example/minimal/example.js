var chart = d3.select('#vis').append('svg')
              .chart('BubbleMatrix')
              .width(400).height(300);

chart.draw(exampleData);
