const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();
const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', routes);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
