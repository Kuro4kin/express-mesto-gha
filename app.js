/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6488055044812463d16a48a0',
  };
  next();
});

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
