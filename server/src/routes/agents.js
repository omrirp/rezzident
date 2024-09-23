import express from 'express';
import bcryptjs from 'bcryptjs';
import Account from '../models/account.js';
import auth from '../middleware/auth.js';

const agentsRouter = express.Router();

//////////////////////////////////////// create new Agent Account ////////////////////////////////////////
agentsRouter.post('/newagent', auth, async (req, res) => {
  try {
    if (req.body.agent.role !== 'Agent') {
      res.status(400).send({ message: 'Account plan must be an Agent' });
    }
    const hash = await bcryptjs.hash(req.body.password, 10);
    let account = new Account({ ...req.body.agent, password: hash });
    await account.save();

    // Convert the document to a plain object
    const accountObject = account.toObject();

    // Remove sensitive properties
    delete accountObject.tokens;
    delete accountObject.companyId;

    res.status(201).send(accountObject);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//////////////////////////////////////// get agents by company ////////////////////////////////////////
agentsRouter.get('/agents/:companyId/:accountId', auth, async (req, res) => {
  try {
    const { companyId, accountId } = req.params;

    // Find agents by companyId and exclude the user with accountId
    const agents = await Account.find({
      companyId,
      // _id: { $ne: accountId }, // Exclude the user with accountId
    }).select('-password -tokens -companyId'); // Exclude the password, tokens and companyId fields;

    res.status(200).send(agents);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

agentsRouter.post('/lock', auth, async (req, res) => {
  try {
    await Account.findByIdAndUpdate(req.body.agentId, { isLocked: req.body.lock }, { runValidators: true });
    const resultMessage = req.body.lock ? 'Locked' : 'Unlocked';
    res.status(202).send(resultMessage);
  } catch (error) {
    res.status(404).send({ message: 'Something went wrong while attempting to update lock status' });
  }
});

export default agentsRouter;
