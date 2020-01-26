require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(res => {
    console.log('connected to mongoDB');
  })
  .catch(error => {
    console.log('error connecting to mongoDB: ', error);
  });

const zoneSchema = new mongoose.Schema({
  name: String,
  zone: String,
  background: String
});

zoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id == returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Zone', zoneSchema);
