const Highcharts = require('highcharts');

require('highcharts/modules/exporting')(Highcharts);

import * as colors from './chartColors';

export function decadesBarChart(data) {
  Highcharts.chart('decades', {
    chart: {
      backgroundColor: colors.BACKGROUND_COLOR,
      type: 'column'
    },
    title: {
      text: 'Number of Movies Watched According to Decade',
      style: {
        color: colors.TITLE_COLOR
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
          color: colors.LABEL_COLOR
        }
      }
    },
    yAxis: {
      min: 0,
      title:  {
        text: 'Movies Watched',
        style: {
          color: colors.TITLE_COLOR
        }
      },
      labels: {
        style: {
          color: colors.LABEL_COLOR
        }
      },
      gridLineColor: colors.GRID_COLOR
    },
    plotOptions: {
    column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [{
      name: 'Jacob',
      data
    }]
  });
}
