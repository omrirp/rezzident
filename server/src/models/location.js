import mongoose from 'mongoose';
import { capitalize } from '../../utils/functions.js';

const locationSchema = new mongoose.Schema({
  country: {
    type: String,
    trim: true,
    require: true,
    maxLength: [30, 'Country must not be over 30 characters'],
    set: capitalize,
  },
  city: {
    type: String,
    trim: true,
    require: true,
    maxLength: [30, 'City must not be over 30 characters'],
    set: capitalize,
  },
  street: {
    type: String,
    trim: true,
    maxLength: [30, 'Street must not be over 30 characters'],
    set: capitalize,
  },
  houseNumber: {
    type: String,
    maxLength: [20, 'House number must not be over 20 characters'],
    trim: true,
  },
  entry: {
    type: String,
    maxLength: [20, 'Entry must not be over 20 characters'],
    trim: true,
  },
});

// Static method to create or update location
locationSchema.statics.createOrUpdateLocation = async function (locationData) {
  let location = await this.findOne(locationData);
  if (!location) {
    location = new this(locationData);
    await location.save();
  }
  return location;
};

const Location = mongoose.model('Location', locationSchema);

export default Location;
