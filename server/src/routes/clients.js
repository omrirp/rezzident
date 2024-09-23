import express from 'express';
import Client from '../models/client.js';
import auth from '../middleware/auth.js';
import Asset from '../models/asset.js';

const clientsRouter = express.Router();

//////////////////////////////////////// Create Client ////////////////////////////////////////
clientsRouter.post('/client', auth, async (req, res) => {
  try {
    const client = new Client(req.body);
    const savedClient = await client.save();
    res.status(201).send(savedClient);
  } catch (error) {
    res.status(500).send({ message: 'Failed to create client' });
  }
});

//////////////////////////////////////// Get Clients by Company ////////////////////////////////////////
clientsRouter.get('/clients/:companyId', auth, async (req, res) => {
  try {
    const { companyId } = req.params;
    const clients = await Client.find({ companyId });
    res.status(200).send(clients);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch clients' });
  }
});

//////////////////////////////////////// Modify client ////////////////////////////////////////
clientsRouter.put('/client', auth, async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.body._id, req.body, { new: true, runValidators: true });

    if (!updatedClient) {
      return res.status(404).send({ message: 'Client not found' });
    }

    res.status(200).send(updatedClient);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update client' });
  }
});

//////////////////////////////////////// Remove Client ////////////////////////////////////////
clientsRouter.delete('/client/:id', auth, async (req, res) => {
  const clientId = req.params.id;

  try {
    // First, delete the client from the Client collection
    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return res.status(404).send({ message: 'Client not found' });
    }

    // Then, remove the client ID from all assets where it appears
    await Asset.updateMany(
      { clients: clientId }, // Condition: Find assets with this client ID
      { $pull: { clients: clientId } } // Update: Remove this client ID from the clients array
    );

    res.status(200).send({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).send({ message: 'Failed to delete client' });
  }
});

export default clientsRouter;
