import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    assetType: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return value.length <= 20;
        },
        message: 'Attribute limited to 20 characters',
      },
    },
    assetStatus: {
      type: String,
      enum: ['New', 'Old'],
      required: true,
      trim: true,
    },
    isExclusive: {
      type: Boolean,
      default: true,
    },
    exclusiveDateExt: {
      type: Date,
      validate: {
        validator: function (value) {
          return value && value >= this.dateOfEntry;
        },
        message: 'Date of entry must be in the future',
      },
    },
    images: [
      {
        type: String,
      },
    ],
    floor: {
      type: Number,
      min: [0, 'Floor must be a positive number'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for bedrooms',
      },
    },
    numberOfFloors: {
      type: Number,
      default: 1,
      min: [0, 'Number of floors must be a 1 or higher'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for bedrooms',
      },
    },
    viewType: {
      type: String,
      trim: true,
      maxLength: [20, 'View type must not be over 20 characters'],
    },
    numberOfAirDirection: {
      type: Number,
      min: [0, 'Number of air direction must be a positive number'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for bedrooms',
      },
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },
    assetDescription: {
      type: String,
      trim: true,
    },
    dealType: {
      type: String,
      required: true,
      enum: ['Rent', 'Sell'],
    },
    dealCost: {
      type: Number,
      min: [0, 'Deal cost must be a positive number'],
      default: 0,
    },
    currency: {
      type: String,
      default: 'NIS',
      enum: ['NIS', 'USD', 'EUR'],
    },
    commissionFee: {
      type: Number,
      min: [0, 'Commission fee must be a positive number'],
      default: 0,
    },
    availability: {
      type: String,
      enum: ['Available', 'Occupied'],
      default: 'Available',
    },
    bedrooms: {
      type: Number,
      min: [0, 'Bedrooms must be a positive number'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for bedrooms',
      },
    },
    bathrooms: {
      type: Number,
      min: [0, 'Bathrooms must be a positive number'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for bedrooms',
      },
    },
    numberOfParkings: {
      type: Number,
      min: [0, 'Number of parkings must be a positive number'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for bedrooms',
      },
    },
    numberOfBalconies: {
      type: Number,
      min: [0, 'Number of balconies must be a positive number'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for bedrooms',
      },
    },
    amenities: [
      {
        type: String,
        trim: true,
        validate: {
          validator: function (value) {
            return value.length <= 20;
          },
          message: 'Attribute limited to 20 characters',
        },
      },
    ],
    assetSquare: {
      type: Number,
      default: 0,
      min: [0, 'Asset Square must be a positive number'],
    },
    gardenSquare: {
      type: Number,
      default: 0,
      min: [0, 'Garden square must be a positive number'],
    },
    dateOfEntry: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: 'Date of entry must be in the future',
      },
    },
    entryType: {
      type: String,
      default: 'Immediately',
      enum: ['Immediately', 'Flexible'],
    },
    agents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
      },
    ],
    clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
      },
    ],
    leads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
      },
    ],
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
