const Highcharts = require('highcharts');

require('highcharts/modules/exporting')(Highcharts);

import * as colors from './chartColors';

export function monthlyViewingLineChart(data, startPoint) {
  Highcharts.chart('monthlyViewing', {
    chart: {
      backgroundColor: colors.BACKGROUND_COLOR,
      type: 'line'
    },
    title: {
      text: 'Number of Movies Watched Per Month',
      style: {
        color: colors.TITLE_COLOR
      }
    },
    xAxis: {
      type: 'datetime',
      minTickInterval: 30 * 24 * 3600 * 1000,
      min: startPoint,
      max: Date.UTC(new Date().getFullYear(), new Date().getMonth()),
      labels: {
        style: {
          color: colors.LABEL_COLOR
        }
      }
    },
    yAxis: {
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
    line: {
        dataLabels: {
          enabled: true
        },
      }
    },
    series: [{
      name: 'Jacob',
      pointInterval: 30 * 24 * 3600 * 1000,
      pointStart: startPoint,
      data
    }]
  });
}
