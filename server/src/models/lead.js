import mongoose from 'mongoose';
import { capitalize } from '../../utils/functions.js';

const LogMessageSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  message: {
    type: String,
    required: true,
  },
});

const LeadSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
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
    phone: {
      type: String,
      required: true,
      maxLength: [20, 'Phone must not be over 20 characters'],
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      maxLength: [50, 'Email name must not be over 50 characters'],
      set: (value) => value.toLowerCase(),
    },
    isHot: {
      type: Boolean,
      default: false,
    },
    agents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
      },
    ],
    log: {
      type: [LogMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

const Lead = mongoose.model('Lead', LeadSchema);

export default Lead;
