/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(('mongodb://127.0.0.1:27017/mestodb'), {
  useNewUrlParser: true,
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = { _id: '652fcf41babac1229d3532b3' };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
