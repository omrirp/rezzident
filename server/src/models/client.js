import mongoose from 'mongoose';
import { capitalize } from '../../utils/functions.js';

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: [20, 'First name must not be over 20 characters'],
      set: capitalize,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: [20, 'Last name must not be over 20 characters'],
      set: capitalize,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: [50, 'Email name must not be over 50 characters'],
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      maxLength: [20, 'Phone must not be over 20 characters'],
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);

export default Client;
