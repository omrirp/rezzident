import express from 'express';
import Company from '../models/company.js';
import Location from '../models/location.js';
import Account from '../models/account.js';
import auth from '../middleware/auth.js';

const companyRouter = express.Router();

//////////////////////////////////////// Get a Company by ID ////////////////////////////////////////
companyRouter.get('/company/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    const location = await Location.findById(company.locationId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).send({ company, location });
  } catch (error) {
    console.error('Error retrieving company:', error);
    res.status(500).send({ message: 'Something went wrong while retrieving company' });
  }
});

//////////////////////////////////////// update a Company or create new ////////////////////////////////////////
companyRouter.put('/updateCompany', auth, async (req, res) => {
  try {
    // ----- Handle Location -----
    let location = await Location.createOrUpdateLocation(req.body.location);

    // ----- Handle Company -----
    let company;
    if (req.body.company._id) {
      company = await Company.findOne({ _id: req.body.company._id });
    }

    if (company) {
      company = await Company.findByIdAndUpdate(
        company._id,
        { ...req.body.company, locationId: location._id },
        { new: true, runValidators: true }
      );
    } else {
      company = new Company({ ...req.body.company, locationId: location._id });
      company = await company.save();
      // ----- Handle Account -----
      await Account.updateOne({ _id: req.body.accountId }, { companyId: company._id });
    }

    // Construct response object with company and location data
    const responseData = { company: company.toObject(), location: location.toObject() };
    res.status(201).send(responseData);
  } catch (error) {
    console.error('Error creating new company:', error);
    res.status(500).send({ message: 'Something went wrong while creating new company' });
  }
});

export default companyRouter;
