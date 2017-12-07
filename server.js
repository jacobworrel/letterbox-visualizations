const express = require('express');
const csv = require('csvtojson');
const moment = require('moment');

const app = express();

app.use(express.static('public'));

app.get('/ratings', (req, res) => {
  const aggregate = {};
  let count = 0;
  csv()
  .fromFile(__dirname + '/data/ratings.csv')
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
});

app.get('/decades', (req, res) => {
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
  .fromFile(__dirname + '/data/watched.csv')
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
});

app.get('/frequency', (req, res) => {
  const originalAggregate = {};
  let startMonth;
  let startPoint;
  let isFirst = true;

  csv()
  .fromFile(__dirname + '/data/diary.csv')
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
      if (originalAggregate[month]) finalAggregate[month] = originalAggregate[month];
      else finalAggregate[month] = 0;
    });
    const months = Object.keys(finalAggregate);
    const moviesWatchedPerMonth = Object.values(finalAggregate);
    const data = [];
    for (let key in finalAggregate) {
      if (finalAggregate.hasOwnProperty(key)) {
        data.push([moment.utc(key).valueOf(), finalAggregate[key]]);
      }
    }
    console.log('data -->', data)
    const payload = { data, startPoint };
    res.send(payload);
  });

});

app.listen(3000, () => console.log('listening on 3000'));
