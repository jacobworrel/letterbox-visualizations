const express = require('express');
const csv = require('csvtojson');

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

app.listen(3000, () => console.log('listening on 3000'));
