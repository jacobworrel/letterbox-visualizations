import { decadesBarChart, monthlyViewingLineChart, ratingsPieChart } from './charts';

(async function() {

  // fetch data for movie ratings
  const ratingsResponse = await fetch('ratings');
  const ratingsData = await ratingsResponse.json();
  ratingsPieChart(ratingsData);

  const statsResponse = await fetch('/stats');
  const stats = await statsResponse.json();
  // destructure values from response object
  const {
    longestStreak: {
      streak: longestStreak,
      streakDays
    },
    maxMoviesFrom1Year: {
      count: bestYearCount,
      Year: bestYear
    },
    maxMoviesIn1Day: {
      count: bestDayCount,
      ["Watched Date"]: bestDay
    },
    mostRewatchedMovie: {
      count: rewatchCount,
      Name: mostRewatchedMovie
    }
  } = stats;

  const statsContainer = document.getElementById('stats');

  function appendHTML(category, stat, detail) {
    // create stat container
    const statContainer = document.createElement('div');
    statContainer.className = 'stat-container';

    // create category element (p tag)
    const categoryElem = document.createElement('p');
    categoryElem.className = 'stat-item';
    const categoryText = document.createTextNode(category);
    categoryElem.appendChild(categoryText);
    statContainer.appendChild(categoryElem);

    // create stat element (h3 tag)
    const statElem = document.createElement('h3');
    statElem.className = 'stat-item';
    const statText = document.createTextNode(stat);
    statElem.appendChild(statText);
    statContainer.appendChild(statElem);

    // create detail element (p tag)
    // create stat element (h3 tag)
    const detailElem = document.createElement('p');
    detailElem.className = 'stat-item';
    const detailText = document.createTextNode(detail);
    detailElem.appendChild(detailText);
    statContainer.appendChild(detailElem);

    statsContainer.appendChild(statContainer);
  }

  appendHTML('Longest streak:', `${longestStreak} days`, `from ${streakDays[0]} to ${streakDays[streakDays.length - 1]}`)
  appendHTML('Most movies watched in one day:', `${bestDayCount} movies`, `on ${bestDay}`);
  appendHTML('Most movies watched from one year:', bestYear, `${bestYearCount} movies from ${bestYear}`);
  appendHTML('Most rewatched movie:', mostRewatchedMovie, `${rewatchCount} times`);

  // fetch data of movies watched by decade
  const decadesResponse = await fetch('decades');
  const decadesData = await decadesResponse.json();
  decadesBarChart(decadesData);

  const monthlyViewingResponse = await fetch('monthlyViewing');
  const monthlyViewingData = await monthlyViewingResponse.json();
  const { data, startPoint } = monthlyViewingData;
  monthlyViewingLineChart(data, startPoint);

})();
