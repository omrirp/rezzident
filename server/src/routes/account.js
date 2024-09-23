import express from 'express';
import bcryptjs from 'bcryptjs';
import Account from '../models/account.js';
import auth from '../middleware/auth.js';

const accountRouter = express.Router();

//////////////////////////////////////// create new Account ////////////////////////////////////////
accountRouter.post('/newaccount', async (req, res) => {
  try {
    const hash = await bcryptjs.hash(req.body.password, 10);
    let account = new Account({ ...req.body, password: hash });
    await account.save();
    const token = await account.generateAuthToken();
    delete account.password;
    delete account.tokens;
    res.status(201).send({ account, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//////////////////////////////////////// log in ////////////////////////////////////////
accountRouter.post('/login', async (req, res) => {
  try {
    let account = await Account.findOne({ email: req.body.email });
    const passwordMatch = await bcryptjs.compare(req.body.password, account.password);
    if (passwordMatch) {
      delete account.password;
      delete account.tokens;
      const token = await account.generateAuthToken();
      res.status(200).send({ account: account, token });
    } else {
      res.status(404).send({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).send({ message: 'something went wrong while attempting to sign in' });
  }
});

//////////////////////////////////////// update an Account ////////////////////////////////////////
accountRouter.put('/update', auth, async (req, res) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true });

    if (!updatedAccount) {
      return res.status(404).send({ message: 'Account not found' });
    }

    res.status(202).send(updatedAccount);
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(400).send({ message: 'Something went wrong while trying to update personal details' });
  }
});

//////////////////////////////////////// update plan ////////////////////////////////////////
accountRouter.put('/updateplan', auth, async (req, res) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(req.body._id, { plan: req.body.plan }, { new: true, runValidators: true });
    res.status(202).send(updatedAccount);
  } catch (error) {
    res.status(400).send({ message: 'Something went wrong while trying to change your plan' });
  }
});

export default accountRouter;
