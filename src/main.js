import { decadesBarChart, monthlyViewingLineChart, ratingsPieChart } from './charts';

(async function() {

  const statsResponse = await fetch('/stats');
  const stats = await statsResponse.json();
  console.log('stats -->', stats)

  // fetch data for movie ratings
  const ratingsResponse = await fetch('ratings');
  const ratingsData = await ratingsResponse.json();
  ratingsPieChart(ratingsData);

  // fetch data of movies watched by decade
  const decadesResponse = await fetch('decades');
  const decadesData = await decadesResponse.json();
  decadesBarChart(decadesData);

  const monthlyViewingResponse = await fetch('monthlyViewing');
  const monthlyViewingData = await monthlyViewingResponse.json();
  const { data, startPoint } = monthlyViewingData;
  monthlyViewingLineChart(data, startPoint);

})();
