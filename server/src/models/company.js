import mongoose from 'mongoose';
import { capitalize } from '../../utils/functions.js';

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    unique: true,
    trim: true,
    maxLength: [30, 'Company name must not be over 30 characters'],
    set: capitalize,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    default: null,
  },
  companyPhone: {
    type: String,
    maxLength: [20, 'Company phone name must not be over 20 characters'],
    trim: true,
  },
  companyEmail: {
    type: String,
    maxLength: [50, 'Company email name must not be over 50 characters'],
    trim: true,
  },
  companyWebsite: {
    type: String,
    maxLength: [200, 'Company website name must not be over 200 characters'],
    trim: true,
  },
});

const Company = mongoose.model('Company', companySchema);

export default Company;
