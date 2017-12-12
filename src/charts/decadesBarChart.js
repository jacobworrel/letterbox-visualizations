const Highcharts = require('highcharts');

require('highcharts/modules/exporting')(Highcharts);

import * as colors from './chartColors';

export function decadesBarChart(data) {
  Highcharts.chart('decades-chart', {
    chart: {
      backgroundColor: colors.BACKGROUND_COLOR,
      type: 'column'
    },
    title: {
      text: 'Number of Movies Watched According to Decade',
      style: {
        color: colors.WHITE
      }
    },
    xAxis: {
      categories: [
        '1910s',
        '1920s',
        '1930s',
        '1940s',
        '1950s',
        '1960s',
        '1970s',
        '1980s',
        '1990s',
        '2000s',
        '2010s'
      ],
      crosshair:  true,
      labels: {
        style: {
          color: colors.GREY
        }
      }
    },
    yAxis: {
      min: 0,
      title:  {
        text: 'Movies Watched',
        style: {
          color: colors.WHITE
        }
      },
      labels: {
        style: {
          color: colors.GREY
        }
      },
      gridLineColor: colors.GREY
    },
    plotOptions: {
      column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
      series: {
        color: colors.DARK_BLUE
      }
    },
    series: [{
      showInLegend: false,
      name: 'Movies Watched:',
      data
    }]
  });
}
