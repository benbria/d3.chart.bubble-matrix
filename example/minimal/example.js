var chart = d3.select().append('svg')
              .chart('BubbleMatrix')
              .width(600).height(400);

chart.draw(exampleData);
