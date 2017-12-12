const Highcharts = require('highcharts');

require('highcharts/modules/exporting')(Highcharts);

import * as colors from './chartColors';

export function ratingsPieChart(data) {
  Highcharts.chart('ratings', {
    chart: {
        backgroundColor: colors.BACKGROUND_COLOR,
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'How You Rate Movies',
        style: {
          color: colors.TITLE_COLOR
        }
    },
    tooltip: {
        formatter: function() {
          return `${this.series.name}: <b>${Highcharts.numberFormat(this.percentage, 1)}</b><br/>${this.point.description}`;
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
    },
    series: [{
        name: 'Percentage',
        colorByPoint: true,
        data
    }]
  });
}
