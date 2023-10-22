/* eslint-disable new-cap */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const isValidUrl = (urlString) => {
  const urlPattern = new RegExp('^(https?:\\/\\/)?'
  + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'
  + '((\\d{1,3}\\.){3}\\d{1,3}))'
  + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'
  + '(\\?[;&a-z\\d%_.~+=-]*)?'
  + '(\\#[-a-z\\d_]*)?$', 'i');
  return !!urlPattern.test(urlString);
};

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isValidUrl(v);
      },
      message: 'wrongUrl',
    },
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.SchemaTypes.ObjectId,
    default: [],
  }],
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model('card', cardSchema);
