const express = require('express');
const controller = require('./controller.js');

const app = express();

app.use(express.static('dist'));

app.get('/stats', controller.getUserStats);
app.get('/ratings', controller.transformRatingsData);
app.get('/decades', controller.transformDecadesData);
app.get('/monthlyViewing', controller.transformMonthlyViewingData);

app.listen(3000, () => console.log('listening on 3000'));
