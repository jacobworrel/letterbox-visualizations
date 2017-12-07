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

  /*
  Create Bar Chart
  Visualizes all movies watched by decade
  x axis --> 1910s 1920s 1930s 1940s 1950s 1960s 1970s 1980s 1990s 2000s 2010s
  */

  Highcharts.chart('decades', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Number of Movies Watched According to Decade'
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

  const frequencyResponse = await fetch('frequency');
  const frequencyData = await frequencyResponse.json();

  console.log('frequencyData -->', frequencyData)
  Highcharts.chart('frequency', {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Number of Movies Watched per Month'
    },
    xAxis: {
      type: 'datetime',
      minTickInterval: 30 * 24 * 3600 * 1000,
      min: frequencyData.startPoint,
      max: Date.UTC(new Date().getFullYear(), new Date().getMonth())
    },
    yAxis: {
      title:  {
        text: 'Movies Watched'
      }
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
      pointStart: frequencyData.startPoint,
      data: frequencyData.data
    }]
  });

})();
