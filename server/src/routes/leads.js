import express from 'express';
import Lead from '../models/lead.js';
import auth from '../middleware/auth.js';
import Asset from '../models/asset.js';

const leadsRouter = express.Router();

//////////////////////////////////////// Create a new lead ////////////////////////////////////////
leadsRouter.post('/lead', auth, async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//////////////////////////////////////// Get leads by account id ////////////////////////////////////////
leadsRouter.get('/leads/:id', auth, async (req, res) => {
  const companyId = req.params.id;

  try {
    const leads = await Lead.find({ companyId });

    if (!leads || leads.length === 0) {
      return res.status(404).send({ message: 'No leads found for the given account ID' });
    }

    res.status(200).send(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).send({ message: error.message});
  }
});

//////////////////////////////////////// Update an existing lead ////////////////////////////////////////
leadsRouter.put('/lead', auth, async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true, runValidators: true });

    if (!updatedLead) {
      return req.status(404).send({ message: 'Lead not found' });
    }

    res.status(200).send(updatedLead);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

//////////////////////////////////////// Add message to log ////////////////////////////////////////
leadsRouter.put('/addtolog', auth, async (req, res) => {
  /**
   * Expected request body
   * req.body = {
   *  leadId,
   *  logMessage
   * }
   */
  try {
    const { leadId, logMessage } = req.body;

    // Validate input
    if (!leadId || !logMessage) {
      return res.status(400).send({ message: 'Lead ID and log message are required' });
    }

    // Find the lead by ID
    let lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).send({ message: 'Lead not found' });
    }

    // Add the log message to the lead's log
    lead.log.push({ date: new Date().toISOString(), message: logMessage });

    // Save the updated lead
    await lead.save();

    // Return the updated lead to the client
    res.status(200).send(lead);
  } catch (error) {
    res.status(500).send({ message: error.message, error });
  }
});

//////////////////////////////////////// Delete lead by id ////////////////////////////////////////
leadsRouter.delete('/lead/:id', auth, async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) {
      return res.status(404).send({ message: 'Lead not found' });
    }

    // Then, remove the client ID from all assets where it appears
    await Asset.updateMany(
      { leads: req.params.id }, // Condition: Find assets with this lead ID
      { $pull: { leads: req.params.id } } // Update: Remove lead client ID from the leads array
    );

    res.status(200).send(deletedLead._id);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default leadsRouter;
