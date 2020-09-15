const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./movies-data-small.json');
require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(validateBearerToken);

function validateBearerToken(req, res, next) {
  const bearerToken = req.get('Authorization').split(' ')[1];
  const authToken = process.env.API_TOKEN;
  if (authToken !== bearerToken) {
    return res.status(401).json({error: 'Access Denied!'});
  }
  next();
}

app.get('/movies', (req, res) => {
  let response = MOVIES;
  let {genre, country, avg_vote} = req.query
  if(genre) {
    response = response.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }
  if(country) {
    response = response.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }
  if(avg_vote) {
    response = response.filter(movie => movie.avg_vote >= parseFloat(avg_vote));
  }
  res.json(response);


});

app.get('/', (req, res) => {
  res.send('Welcome Home!');
});

app.listen(9000, () => {
  console.log('server listening on 9000');
});