import express from 'express';
import Deal from '../models/deal.js';
import auth from '../middleware/auth.js';

const dealsRouter = express.Router();

//////////////////////////////////////// Get All Deals by Company ////////////////////////////////////////
dealsRouter.get('/deals/:companyId', auth, async (req, res) => {
  try {
    const deals = await Deal.find({ companyId: req.params.companyId });
    res.status(200).send(deals);
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong while trying to fetch the deals' });
  }
});

export default dealsRouter;
