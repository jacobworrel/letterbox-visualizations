const csv = require('csvtojson');
const moment = require('moment');

const controller = {};

controller.transformRatingsData = function(req, res) {
  const aggregate = {};
  let count = 0;
  csv()
  .fromFile(__dirname + '/../data/ratings.csv')
  .on('json', (movie) => {
    if (movie.Rating) {
      if (!aggregate[movie.Rating]) aggregate[movie.Rating] = 0;
      aggregate[movie.Rating] += 1;
      count += 1;
    }
  })
  .on('done', (error) => {
    const ratings = Object.keys(aggregate).sort();
    const data = ratings.map((rating) => {
      const percentage = +((aggregate[rating] / count) * 100);
      return {
        name: `${rating} Star Rating`,
        y: percentage,
        description: `${aggregate[rating]} movies with a ${rating} star rating.`
      };
    });
    res.send(data);
  });
}

controller.transformDecadesData = function(req, res) {
  const aggregate = {
    "1910s": 0,
    "1920s": 0,
    "1930s": 0,
    "1940s": 0,
    "1950s": 0,
    "1960s": 0,
    "1970s": 0,
    "1980s": 0,
    "1990s": 0,
    "2000s": 0,
    "2010s": 0
  };
  csv()
  .fromFile(__dirname + '/../data/watched.csv')
  .on('json', (movie) => {
    if (movie.Year >= 1910 && movie.Year < 1920) aggregate["1910s"] += 1;
    if (movie.Year >= 1920 && movie.Year < 1930) aggregate["1920s"] += 1;
    if (movie.Year >= 1930 && movie.Year < 1940) aggregate["1930s"] += 1;
    if (movie.Year >= 1940 && movie.Year < 1950) aggregate["1940s"] += 1;
    if (movie.Year >= 1950 && movie.Year < 1960) aggregate["1950s"] += 1;
    if (movie.Year >= 1960 && movie.Year < 1970) aggregate["1960s"] += 1;
    if (movie.Year >= 1970 && movie.Year < 1980) aggregate["1970s"] += 1;
    if (movie.Year >= 1980 && movie.Year < 1990) aggregate["1980s"] += 1;
    if (movie.Year >= 1990 && movie.Year < 2000) aggregate["1990s"] += 1;
    if (movie.Year >= 2000 && movie.Year < 2010) aggregate["2000s"] += 1;
    if (movie.Year >= 2010 && movie.Year < 2020) aggregate["2010s"] += 1;
  })
  .on('done', (error) => {
    const moviesWatchedByDecade = Object.values(aggregate);
    res.send(moviesWatchedByDecade);
  });
}

controller.transformMonthlyViewingData = function(req, res) {
  const originalAggregate = {};
  let startMonth;
  let startPoint;
  let isFirst = true;

  csv()
  .fromFile(__dirname + '/../data/diary.csv')
  .on('json', (movie) => {
    if (isFirst) {
      const year = +movie['Watched Date'].slice(0, 4);
      const month = (+movie['Watched Date'].slice(5, 7)) - 1;
      startPoint = Date.UTC(year, month);
      startMonth = moment(movie['Watched Date'].slice(0, 7));
      isFirst = false;
    }
    const currMonth = movie['Watched Date'].slice(0, 7);
    if (!originalAggregate[currMonth]) originalAggregate[currMonth] = 0;
    originalAggregate[currMonth] += 1;
  })
  .on('done', (error) => {
    const endMonth = moment();
    const range = [];
    while (endMonth >= startMonth) {
      range.push(startMonth.format('YYYY-MM'));
      startMonth.add(1, 'months');
    }
    const finalAggregate = {};
    range.forEach((month) => {
      // if month is in original aggregate object, copy values over to final aggregate object
      if (originalAggregate[month]) finalAggregate[month] = originalAggregate[month];
      // if month is not in original aggregate object, add it to final aggregate object and set value to 0
      else finalAggregate[month] = 0;
    });
    // transform data into an array of subarrays (with values for x and y)
    const data = [];
    for (let key in finalAggregate) {
      if (finalAggregate.hasOwnProperty(key)) {
        data.push([moment.utc(key).valueOf(), finalAggregate[key]]);
      }
    }
    const payload = { data, startPoint };
    res.send(payload);
  });
}

controller.getUserStats = async function(req, res) {
  let maxMoviesIn1Day = { count: 0, "Watched Date": '' };
  let maxMoviesFrom1Year = { count: 0, "Year": '' };
  let mostRewatchedMovie = { count: 0, "Name": '' };
  let moviesWatchedByDate = {};
  let moviesWatchedByYear = {};
  let movieWatchCount = {};

  const longestStreak = await controller.parseCSV(
    '/../data/diary.csv',
    (movie) => {
      controller.populateCache(movie, moviesWatchedByDate, 'Watched Date', maxMoviesIn1Day);
      controller.populateCache(movie, movieWatchCount, 'Name', mostRewatchedMovie);
    },
    (error) => {
      if (error) controller.reject(error);
      const longestStreak = controller.getLongestStreak(moviesWatchedByDate)
      controller.resolve(longestStreak);
    }
  );

  await controller.parseCSV(
    '/../data/watched.csv',
    (movie) => {
      controller.populateCache(movie, moviesWatchedByYear, 'Year', maxMoviesFrom1Year);
    },
    (error) => {
      if (error) controller.reject(err);
      controller.resolve();
    }
  );

  const streakDaysFormatted = longestStreak.streakDays.map(date => {
    return moment(date).format('MMM Do YYYY');
  });
  const bestDayFormatted = moment(maxMoviesIn1Day["Watched Date"]).format('MMM Do YYYY');

  const payload = {
    maxMoviesIn1Day: {
      count: maxMoviesIn1Day.count,
      "Watched Date": bestDayFormatted
    },
    mostRewatchedMovie,
    longestStreak: {
      streak: longestStreak.streak,
      streakDays: streakDaysFormatted
    },
    maxMoviesFrom1Year
  };

  res.send(payload);
}

// HELPER FUNCTIONS

controller.parseCSV = function(path, onJsonCallback, onDoneCallback) {
  return new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
    csv()
    .fromFile(__dirname + path)
    .on('json', onJsonCallback)
    .on('done', onDoneCallback);
  });
}

controller.populateCache = function(movie, cache, category, tracker) {
  const key = movie[category];
  if (!cache[key]) cache[key] = 0;
  cache[key] += 1;
  if (cache[key] > tracker.count) {
    tracker.count = cache[key];
    tracker[category] = key;
  }
}

controller.getLongestStreak = function(data) {
  let currStreak = { streak: 0, streakDays: [] };
  const dates = Object.keys(data);
  return dates.reduce((acc, curr, i) => {
    const prev = dates[i - 1];
    if (prev && moment(curr).diff(moment(prev), 'days') === 1) {
      currStreak.streak += 1;
      currStreak.streakDays.push(curr);
    } else {
      currStreak.streak = 1;
      currStreak.streakDays = [curr];
    }
    return currStreak.streak > acc.streak ? { streak: currStreak.streak, streakDays: currStreak.streakDays.slice() } : acc;
  }, { streak: 0, streakDays: [] });
}

module.exports = controller;
