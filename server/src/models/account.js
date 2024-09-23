import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const accountSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: [20, 'First name must not be over 20 characters'],
      set: (value) => value[0].toUpperCase() + value.slice(1, value.length),
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: [20, 'Last name must not be over 20 characters'],
      set: (value) => value[0].toUpperCase() + value.slice(1, value.length),
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      maxLength: [50, 'Email name must not be over 50 characters'],
      set: (value) => value.toLowerCase(),
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
      maxLength: [20, 'Phone must not be over 20 characters'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company', // Assuming Company is the name of the related model
      default: null,
      unique: false,
    },
    position: {
      type: String,
      trim: true,
      default: null,
      maxLength: [20, 'Position must not be over 20 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      enum: ['Admin', 'Client', 'Agent'], // Specify the allowed values
      default: 'Admin',
    },
    plan: {
      type: String,
      enum: ['Basic', 'Premium', 'Platinum'],
      default: 'Basic',
    },
    tokens: [
      {
        token: {
          type: String,
        },
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Generate authentication token for the account
 */
accountSchema.methods.generateAuthToken = async function () {
  const account = this;
  const token = jwt.sign({ _id: account._id.toString() }, process.env.TOKEN_KEY, { expiresIn: '30d' });

  account.tokens = account.tokens.concat({ token });
  await account.save();

  return token;
};

const Account = mongoose.model('Account', accountSchema);

export default Account;
