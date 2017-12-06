(async function() {

  // fetch data for movie ratings
  const ratingsResponse = await fetch('ratings');
  const ratingsData = await ratingsResponse.json();

  Highcharts.chart('ratings', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'How You Rate Movies'
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
        data: ratingsData
    }]
  });

  // fetch data of movies watched by decade
  const decadesResponse = await fetch('decades');
  const decadesData = await decadesResponse.json();

  Highcharts.chart('decades', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Movies Watched by Decade'
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
      crosshair:  true
    },
    yAxis: {
      min: 0,
      title:  {
        text: 'Movies Watched'
      }
    },
    plotOptions: {
    column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [{
      name: 'Jacob',
      data: decadesData
    }]
  });

})();

/*

Bar Chart
Visualizes all movies watched by year

1910 1920 1930 1940 1950 1960 1970 1980 1990 2000 2010

*/
