const Highcharts = require('highcharts');

require('highcharts/modules/exporting')(Highcharts);

import * as colors from './chartColors';

export function monthlyViewingLineChart(data, startPoint) {
  Highcharts.chart('monthly-viewing-chart', {
    chart: {
      backgroundColor: colors.BACKGROUND_COLOR,
      type: 'line'
    },
    title: {
      text: 'Number of Movies Watched Per Month',
      style: {
        color: colors.WHITE
      }
    },
    xAxis: {
      type: 'datetime',
      minTickInterval: 30 * 24 * 3600 * 1000,
      min: startPoint,
      max: Date.UTC(new Date().getFullYear(), new Date().getMonth()),
      labels: {
        style: {
          color: colors.GREY
        }
      }
    },
    yAxis: {
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
      // minorGridLineWidth: 0,
      // lineWidth: 0,
      gridLineColor: 'transparent'
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
          style: {
            color: colors.WHITE,
            textOutline: false
          }
        },
      },
      series: {
        color: colors.DARK_BLUE
      }
    },
    series: [{
      name: 'Movies Watched',
      showInLegend: false,
      pointInterval: 30 * 24 * 3600 * 1000,
      pointStart: startPoint,
      data
    }]
  });
}
