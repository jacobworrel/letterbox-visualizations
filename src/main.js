import * as charts from './charts';

(async function() {

  // fetch data for movie ratings
  const ratingsResponse = await fetch('ratings');
  const ratingsData = await ratingsResponse.json();

  charts.buildRatingsChart(ratingsData);

  // fetch data of movies watched by decade
  const decadesResponse = await fetch('decades');
  const decadesData = await decadesResponse.json();

  charts.buildDecadesChart(decadesData);

  const frequencyResponse = await fetch('frequency');
  const frequencyData = await frequencyResponse.json();
  const { data, startPoint } = frequencyData;
  charts.buildFrequencyChart(data, startPoint);

})();
