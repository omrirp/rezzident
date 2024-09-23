import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    require: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  commissionFee: {
    type: Number,
    require: true,
    min: [0, 'commission fee must be a positive number'],
  },
  currency: {
    type: String,
    enum: ['USD', 'NIS', 'EUR'],
    require: true,
  },
});

dealSchema.index({ accountId: 1 });
dealSchema.index({ companyId: 1 });

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;
