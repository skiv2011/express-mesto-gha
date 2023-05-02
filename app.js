/* eslint-disable eol-last */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;
mongoose.set('strictQuery', true);

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '644fc4742600b2fb002726d4',
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', users);
app.use('/', cards);

mongoose
  .connect('mongodb://127.0.0.1/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения:', err));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
